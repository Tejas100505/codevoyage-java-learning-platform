package com.codevoyage.submission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.challenge.CodingChallengeRepository;
import com.codevoyage.challenge.TestCase;
import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.execution.DiagnosticParser;
import com.codevoyage.execution.ExecutionClient;
import com.codevoyage.execution.OutputNormalizer;
import com.codevoyage.execution.dto.SandboxExecutionResponse;
import com.codevoyage.mission.Mission;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.ProgressService;
import com.codevoyage.progress.UserProgress;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.submission.dto.SubmissionResultDTO;
import com.codevoyage.submission.dto.TestExecutionResultDTO;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubmissionService {

    private final MissionRepository missionRepository;
    private final CodingChallengeRepository codingChallengeRepository;
    private final ExecutionClient executionClient;
    private final DiagnosticParser diagnosticParser;
    private final OutputNormalizer outputNormalizer;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final ProgressService progressService;

    public SubmissionService(
            MissionRepository missionRepository,
            CodingChallengeRepository codingChallengeRepository,
            ExecutionClient executionClient,
            DiagnosticParser diagnosticParser,
            OutputNormalizer outputNormalizer,
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            ProgressService progressService
    ) {
        this.missionRepository = missionRepository;
        this.codingChallengeRepository = codingChallengeRepository;
        this.executionClient = executionClient;
        this.diagnosticParser = diagnosticParser;
        this.outputNormalizer = outputNormalizer;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.progressService = progressService;
    }

    /**
     * Trial run: Executes code strictly against VISIBLE test cases.
     * Does not persist completion or award XP.
     */
    public SubmissionResultDTO runCode(Long missionId, String sourceCode, String username) {
        CodingChallenge challenge = getChallengeForMission(missionId);
        List<TestCase> visibleCases = challenge.getTestCases().stream()
                .filter(tc -> !Boolean.TRUE.equals(tc.getHidden()))
                .toList();

        return evaluatePipeline(challenge, visibleCases, List.of(), sourceCode);
    }

    /**
     * Official submission:
     * Student submits code
     * ↓
     * Compile
     * ↓
     * If compilation fails → show error
     * ↓
     * Execute visible tests
     * ↓
     * If visible tests fail → show failures
     * ↓
     * If visible tests pass → execute hidden tests
     * ↓
     * If hidden tests pass → complete challenge
     * ↓
     * Award XP (only on first completion)
     * ↓
     * Calculate stars
     * ↓
     * Save progress
     * ↓
     * Unlock next mission
     */
    @Transactional
    public SubmissionResultDTO submitCode(Long missionId, String sourceCode, String username) {
        CodingChallenge challenge = getChallengeForMission(missionId);
        User user = (username != null)
                ? userRepository.findByUsername(username).orElse(null)
                : null;

        List<TestCase> visibleCases = challenge.getTestCases().stream()
                .filter(tc -> !Boolean.TRUE.equals(tc.getHidden()))
                .toList();

        List<TestCase> hiddenCases = challenge.getTestCases().stream()
                .filter(tc -> Boolean.TRUE.equals(tc.getHidden()))
                .toList();

        // Run full evaluation through sequenced stages
        SubmissionResultDTO result = evaluatePipeline(challenge, visibleCases, hiddenCases, sourceCode);

        // Record submission in database
        if (user != null) {
            progressService.recordAttempt(user.getId(), missionId);

            Submission submission = new Submission(
                    user,
                    challenge,
                    sourceCode,
                    result.getStatus(),
                    result.getDiagnosticHint() != null ? result.getDiagnosticHint() : result.getStdout(),
                    result.getExecutionTimeMs()
            );
            submissionRepository.save(submission);

            if (result.isCompleted()) {
                // Check if challenge was already completed to prevent duplicate XP
                var existingProgress = userProgressRepository.findByUserIdAndMissionId(user.getId(), missionId);
                boolean wasAlreadyCompleted = existingProgress
                        .map(up -> Boolean.TRUE.equals(up.getCompleted()))
                        .orElse(false);

                int hintsUsed = existingProgress.map(up -> up.getHintsUsed() != null ? up.getHintsUsed() : 0).orElse(0);
                int attempts = existingProgress.map(up -> up.getAttempts() != null ? up.getAttempts() : 1).orElse(1);
                int stars = progressService.calculateStars(hintsUsed, attempts);

                int baseMissionXp = challenge.getMission().getXpReward() != null ? challenge.getMission().getXpReward() : 100;
                long durationSeconds = Math.max(1, result.getExecutionTimeMs() / 1000);

                // If already completed, award 0 XP for this retry, but allow stars calculation
                int xpToAward = wasAlreadyCompleted ? 0 : baseMissionXp;

                progressService.completeMission(user.getId(), missionId, stars, xpToAward, durationSeconds);

                result.setStarsEarned(stars);
                result.setXpEarned(xpToAward);

                if (wasAlreadyCompleted) {
                    result.setDiagnosticHint("Mission cleared again! Telemetry verified (XP already claimed on first completion).");
                }

                // Authoritative Planet-Completion and Next-World Advancement Detection
                if (challenge.getMission() != null && challenge.getMission().getWorld() != null) {
                    var currentWorld = challenge.getMission().getWorld();
                    var worldMissions = missionRepository.findByWorldIdOrderByMissionOrderAsc(currentWorld.getId());
                    var userWorldProgress = userProgressRepository.findByUserId(user.getId()).stream()
                            .filter(up -> up.getMission() != null && up.getMission().getWorld() != null && up.getMission().getWorld().getId().equals(currentWorld.getId()))
                            .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                            .toList();

                    boolean isWorldCompleted = !worldMissions.isEmpty() && userWorldProgress.size() >= worldMissions.size();
                    result.setWorldCompleted(isWorldCompleted);
                    result.setCompletedWorldName(currentWorld.getName());
                    result.setCompletedWorldOrder(currentWorld.getWorldOrder());
                    result.setTotalMissionsInWorld(worldMissions.size());
                    result.setCompletedMissionsInWorld(userWorldProgress.size());

                    if (isWorldCompleted) {
                        missionRepository.findAll().stream()
                                .map(Mission::getWorld)
                                .filter(java.util.Objects::nonNull)
                                .filter(w -> w.getWorldOrder() != null && w.getWorldOrder() == currentWorld.getWorldOrder() + 1)
                                .findFirst()
                                .ifPresent(nextWorld -> {
                                    result.setNextWorldUnlocked(true);
                                    result.setNextWorldId(nextWorld.getId());
                                    result.setNextWorldName(nextWorld.getName());
                                    result.setNextWorldOrder(nextWorld.getWorldOrder());
                                });
                    }
                }
            }
        } else {
            if (result.isCompleted()) {
                result.setDiagnosticHint("Telemetry evaluated successfully. Notice: You are unauthenticated; log in to permanently record your clearance and XP with Starfleet Command.");
            }
        }

        return result;
    }

    /**
     * Staged execution pipeline:
     * 1. Compile & Sample execution
     * 2. Visible tests evaluation
     * 3. Hidden tests evaluation (only if visible tests pass)
     */
    private SubmissionResultDTO evaluatePipeline(
            CodingChallenge challenge,
            List<TestCase> visibleCases,
            List<TestCase> hiddenCases,
            String sourceCode
    ) {
        SubmissionResultDTO dto = new SubmissionResultDTO();
        List<TestExecutionResultDTO> testResults = new ArrayList<>();

        int totalTestCount = visibleCases.size() + hiddenCases.size();
        dto.setTotalTests(totalTestCount);

        // 1. Compile & Initial Execution on first visible test (or empty stdin)
        String sampleStdin = visibleCases.isEmpty() ? "" : (visibleCases.get(0).getInput() != null ? visibleCases.get(0).getInput() : "");
        SandboxExecutionResponse initialRun = executionClient.execute(sourceCode, "Solution", sampleStdin, 5000);

        dto.setExecutionTimeMs(initialRun.getExecutionTimeMs());

        // Step 1: If compilation fails → show error
        if (!initialRun.isSuccess()) {
            dto.setSuccess(false);
            dto.setCompleted(false);
            dto.setStatus(initialRun.getStatus());
            dto.setStdout(initialRun.getStdout());

            DiagnosticParser.DiagnosticInfo diag = diagnosticParser.parse(initialRun.getStatus(), initialRun.getStderr());
            dto.setStderr(diag.sanitizedError());
            dto.setErrorLine(diag.lineNumber());
            dto.setDiagnosticHint(diag.beginnerExplanation());
            dto.setPassedTests(0);
            dto.setTestCases(testResults);
            return dto;
        }

        dto.setStdout(initialRun.getStdout());
        long totalExecutionTime = initialRun.getExecutionTimeMs();

        // Step 2: Execute visible tests
        boolean allVisiblePassed = true;
        int passedCount = 0;

        for (int i = 0; i < visibleCases.size(); i++) {
            TestCase tc = visibleCases.get(i);
            String stdin = tc.getInput() != null ? tc.getInput() : "";

            SandboxExecutionResponse tcRun;
            if (i == 0 && stdin.equals(sampleStdin)) {
                tcRun = initialRun;
            } else {
                tcRun = executionClient.execute(sourceCode, "Solution", stdin, 4000);
                totalExecutionTime += tcRun.getExecutionTimeMs();
            }

            boolean passed = tcRun.isSuccess() && outputNormalizer.matches(tc.getExpectedOutput(), tcRun.getStdout());

            if (passed) {
                passedCount++;
            } else {
                allVisiblePassed = false;
            }

            // Visible tests return passed, expected, and actual (normalized)
            testResults.add(new TestExecutionResultDTO(
                    tc.getId(),
                    tc.getDescription() != null ? tc.getDescription() : ("Visible Test Case " + (i + 1)),
                    tc.getInput(),
                    outputNormalizer.normalize(tc.getExpectedOutput()),
                    outputNormalizer.normalize(tcRun.getStdout()),
                    passed,
                    false
            ));
        }

        dto.setExecutionTimeMs(totalExecutionTime);

        // Step 3: If visible tests fail → show failures and DO NOT run hidden tests
        if (!allVisiblePassed) {
            dto.setSuccess(false);
            dto.setCompleted(false);
            dto.setStatus("WRONG_ANSWER");
            dto.setPassedTests(passedCount);
            dto.setTestCases(testResults);
            dto.setDiagnosticHint("Visible test cases failed. Inspect expected vs actual output.");
            return dto;
        }

        // Step 4: If visible tests pass → execute hidden tests
        boolean allHiddenPassed = true;

        for (int i = 0; i < hiddenCases.size(); i++) {
            TestCase htc = hiddenCases.get(i);
            String stdin = htc.getInput() != null ? htc.getInput() : "";

            SandboxExecutionResponse htcRun = executionClient.execute(sourceCode, "Solution", stdin, 4000);
            totalExecutionTime += htcRun.getExecutionTimeMs();

            boolean passed = htcRun.isSuccess() && outputNormalizer.matches(htc.getExpectedOutput(), htcRun.getStdout());

            if (passed) {
                passedCount++;
            } else {
                allHiddenPassed = false;
            }

            // For hidden tests: NEVER return hidden inputs or expected hidden output to the frontend!
            testResults.add(new TestExecutionResultDTO(
                    htc.getId(),
                    htc.getDescription() != null ? htc.getDescription() : ("Hidden Verification " + (i + 1)),
                    null,   // Hidden input strictly masked
                    null,   // Hidden expected output strictly masked
                    null,   // Hidden actual output strictly masked
                    passed,
                    true    // hidden = true
            ));
        }

        dto.setExecutionTimeMs(totalExecutionTime);
        dto.setPassedTests(passedCount);
        dto.setTestCases(testResults);

        // Step 5: If hidden tests pass → complete challenge
        boolean allPassed = allVisiblePassed && allHiddenPassed && (totalTestCount > 0);
        dto.setSuccess(allPassed);
        dto.setCompleted(allPassed);

        if (allPassed) {
            dto.setStatus("SUCCESS");
            dto.setDiagnosticHint("All diagnostic telemetry verified. Ship system cleared.");
        } else {
            dto.setStatus("WRONG_ANSWER");
            dto.setDiagnosticHint("Hidden test case failed. Verify boundary conditions, special edge inputs, and formatting.");
        }

        return dto;
    }

    private CodingChallenge getChallengeForMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Mission not found: " + missionId));

        return codingChallengeRepository.findByMissionId(mission.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No coding challenge calibrated for mission: " + missionId));
    }
}
