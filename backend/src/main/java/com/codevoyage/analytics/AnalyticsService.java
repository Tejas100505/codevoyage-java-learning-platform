package com.codevoyage.analytics;

import com.codevoyage.analytics.dto.*;
import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.mission.Mission;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.UserProgress;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.submission.Submission;
import com.codevoyage.submission.SubmissionRepository;
import com.codevoyage.user.Role;
import com.codevoyage.user.User;
import com.codevoyage.user.UserLevelSystem;
import com.codevoyage.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final SubmissionRepository submissionRepository;
    private final MissionRepository missionRepository;

    public AnalyticsService(
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            SubmissionRepository submissionRepository,
            MissionRepository missionRepository
    ) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.submissionRepository = submissionRepository;
        this.missionRepository = missionRepository;
    }

    /**
     * Get learning analytics overview for authenticated cadet.
     */
    @Transactional(readOnly = true)
    public UserAnalyticsDTO getUserAnalytics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found: " + username));

        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        List<Submission> submissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        List<Mission> allMissions = missionRepository.findAll();

        Map<Long, UserProgress> progressByMissionId = userProgressList.stream()
                .collect(Collectors.toMap(up -> up.getMission().getId(), up -> up, (a, b) -> a));

        UserAnalyticsDTO analytics = new UserAnalyticsDTO();
        analytics.setUserId(user.getId());
        analytics.setUsername(user.getUsername());
        int actualXp = user.getXp() != null ? user.getXp() : 0;
        analytics.setCurrentXp(actualXp);
        analytics.setRankTitle(UserLevelSystem.getRankTitle(UserLevelSystem.calculateLevel(actualXp)));

        // 1. Lessons completed count
        int lessonsCompleted = (int) userProgressList.stream()
                .filter(up -> Boolean.TRUE.equals(up.getLessonCompleted()))
                .count();
        analytics.setLessonsCompleted(lessonsCompleted);

        // 2. Practice questions attempted and practice accuracy
        int practiceCompletedCount = (int) userProgressList.stream()
                .filter(up -> Boolean.TRUE.equals(up.getPracticeCompleted()))
                .count();
        int practiceQuestionsAttempted = practiceCompletedCount * 4;
        analytics.setPracticeQuestionsAttempted(practiceQuestionsAttempted);

        int practiceAccuracy = 0;
        if (practiceCompletedCount > 0) {
            double totalAccuracySum = 0;
            for (UserProgress up : userProgressList) {
                if (Boolean.TRUE.equals(up.getPracticeCompleted())) {
                    int attempts = up.getAttempts() != null ? up.getAttempts() : 1;
                    double missionPracticeAcc = Math.max(70.0, 100.0 - (attempts > 3 ? (attempts - 3) * 5.0 : 0));
                    totalAccuracySum += missionPracticeAcc;
                }
            }
            practiceAccuracy = (int) Math.round(totalAccuracySum / practiceCompletedCount);
        }
        analytics.setPracticeAccuracyPercentage(practiceAccuracy);

        // 3. Coding challenges completed & attempts
        int challengesCompleted = (int) userProgressList.stream()
                .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                .count();
        analytics.setCodingChallengesCompleted(challengesCompleted);

        int totalCodingAttempts = submissions.size();
        if (totalCodingAttempts == 0) {
            totalCodingAttempts = userProgressList.stream()
                    .mapToInt(up -> up.getAttempts() != null ? up.getAttempts() : 0)
                    .sum();
        }
        analytics.setCodingAttempts(totalCodingAttempts);

        // 4. Test success rate, compilation success rate & submission classifications
        int successfulSubmissions = 0;
        int syntaxErrors = 0;
        int runtimeErrors = 0;
        int wrongAnswers = 0;
        for (Submission sub : submissions) {
            String status = sub.getStatus();
            if ("SUCCESS".equalsIgnoreCase(status)) {
                successfulSubmissions++;
            } else if ("COMPILE_ERROR".equalsIgnoreCase(status)) {
                syntaxErrors++;
            } else if ("RUNTIME_ERROR".equalsIgnoreCase(status) || "TIMEOUT".equalsIgnoreCase(status)) {
                runtimeErrors++;
            } else if ("WRONG_ANSWER".equalsIgnoreCase(status)) {
                wrongAnswers++;
            }
        }
        analytics.setSyntaxErrorsEncountered(syntaxErrors);
        analytics.setRuntimeErrorsEncountered(runtimeErrors);
        analytics.setLogicFailuresEncountered(wrongAnswers);

        double testSuccessRate = totalCodingAttempts > 0
                ? Math.round((successfulSubmissions * 100.0 / totalCodingAttempts) * 10.0) / 10.0
                : 0.0;
        if (challengesCompleted > 0 && testSuccessRate == 0.0) {
            testSuccessRate = Math.min(100.0, Math.round((challengesCompleted * 100.0 / Math.max(1, totalCodingAttempts)) * 10.0) / 10.0);
        }
        analytics.setTestSuccessRate(testSuccessRate);

        double compilationSuccessRate = totalCodingAttempts > 0
                ? Math.round(((totalCodingAttempts - syntaxErrors) * 100.0 / totalCodingAttempts) * 10.0) / 10.0
                : 0.0;
        analytics.setCompilationSuccessRate(compilationSuccessRate);

        // Average attempts per challenge
        double avgAttempts = challengesCompleted > 0
                ? Math.round((totalCodingAttempts * 1.0 / challengesCompleted) * 10.0) / 10.0
                : (totalCodingAttempts > 0 ? totalCodingAttempts : 0);
        analytics.setAverageAttemptsPerChallenge(avgAttempts);

        // First attempt passes
        int firstAttemptPasses = (int) userProgressList.stream()
                .filter(up -> Boolean.TRUE.equals(up.getCompleted()) && (up.getAttempts() == null || up.getAttempts() <= 1))
                .count();
        analytics.setFirstAttemptPasses(firstAttemptPasses);

        // 5. Hints used
        int totalHintsUsed = userProgressList.stream()
                .mapToInt(up -> up.getHintsUsed() != null ? up.getHintsUsed() : 0)
                .sum();
        analytics.setHintsUsed(totalHintsUsed);

        // 6. Time spent
        long totalSeconds = userProgressList.stream()
                .mapToLong(up -> up.getCompletionTimeSeconds() != null ? up.getCompletionTimeSeconds() : 0L)
                .sum();
        analytics.setTotalTimeSpentSeconds(totalSeconds);
        analytics.setFormattedTimeSpent(formatTime(totalSeconds));

        // 7. World Progress
        int totalMissions = allMissions.size();
        analytics.setTotalMissionsCount(totalMissions);
        analytics.setCompletedMissionsCount(challengesCompleted);
        int worldProgress = totalMissions > 0 ? (int) Math.round((challengesCompleted * 100.0) / totalMissions) : 0;
        analytics.setWorldProgressPercentage(worldProgress);

        // 8. Evidence-Based Concept Mastery Calculation
        List<ConceptMasteryDTO> conceptList = buildEvidenceBasedMasteries(progressByMissionId, submissions);
        analytics.setConceptMasteries(conceptList);

        // Active concept mastery average (only across attempted or available concepts)
        List<ConceptMasteryDTO> attemptedConcepts = conceptList.stream()
                .filter(c -> !"NOT_ATTEMPTED".equals(c.getEvidenceStatus()) || c.getMasteryPercentage() > 0)
                .collect(Collectors.toList());

        int activeAvgMastery = attemptedConcepts.isEmpty() ? 0 : (int) Math.round(
                attemptedConcepts.stream().mapToInt(ConceptMasteryDTO::getMasteryPercentage).average().orElse(0)
        );
        analytics.setActiveConceptMasteryPercentage(activeAvgMastery);

        // Data sufficiency flag
        analytics.setHasSufficientData(totalCodingAttempts > 0 || challengesCompleted > 0 || lessonsCompleted > 0);

        // Segregate Strong Concepts vs Concepts Needing Practice
        List<String> strong = new ArrayList<>();
        List<String> needingPractice = new ArrayList<>();

        for (ConceptMasteryDTO cm : conceptList) {
            if (cm.getMasteryPercentage() >= 75 && cm.isChallengeCompleted()) {
                strong.add(cm.getConceptName());
            } else if ("NEEDS_PRACTICE".equals(cm.getStatus()) || (cm.getMasteryPercentage() > 0 && cm.getMasteryPercentage() < 75)) {
                needingPractice.add(cm.getConceptName());
            }
        }
        if (strong.isEmpty() && needingPractice.isEmpty() && !conceptList.isEmpty()) {
            needingPractice.add(conceptList.get(0).getConceptName());
        }
        analytics.setStrongConcepts(strong);
        analytics.setConceptsNeedingPractice(needingPractice);

        // 9. Common Errors Diagnostics
        analytics.setCommonErrors(detectCommonErrors(submissions, userProgressList));

        return analytics;
    }

    /**
     * Phase 3: Performance Trends time-series from real persisted submission records.
     */
    @Transactional(readOnly = true)
    public PerformanceTrendsResponseDTO getPerformanceTrends(String username, String range) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found: " + username));

        List<Submission> allSubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());

        String validRange = ("30d".equalsIgnoreCase(range) || "all".equalsIgnoreCase(range)) ? range.toLowerCase() : "7d";
        LocalDate today = LocalDate.now();
        LocalDate startDate;

        if ("30d".equals(validRange)) {
            startDate = today.minusDays(29);
        } else if ("all".equals(validRange)) {
            startDate = allSubmissions.isEmpty() ? today.minusDays(6) : allSubmissions.get(allSubmissions.size() - 1).getSubmittedAt().toLocalDate();
        } else {
            startDate = today.minusDays(6);
        }

        // Filter submissions within range
        List<Submission> filteredSubmissions = allSubmissions.stream()
                .filter(s -> !s.getSubmittedAt().toLocalDate().isBefore(startDate))
                .collect(Collectors.toList());

        Map<LocalDate, List<Submission>> subsByDate = filteredSubmissions.stream()
                .collect(Collectors.groupingBy(s -> s.getSubmittedAt().toLocalDate()));

        List<PerformanceTrendPointDTO> trendPoints = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        int cumulativeCompleted = 0;
        int totalPeriodSubmissions = filteredSubmissions.size();
        int totalPeriodSuccesses = 0;
        int totalPeriodCompiles = 0;

        // Iterate date by date from startDate to today
        LocalDate cur = startDate;
        while (!cur.isAfter(today)) {
            List<Submission> daySubs = subsByDate.getOrDefault(cur, Collections.emptyList());
            int dayTotal = daySubs.size();
            int daySuccess = (int) daySubs.stream().filter(s -> "SUCCESS".equalsIgnoreCase(s.getStatus())).count();
            int dayCompilePass = (int) daySubs.stream().filter(s -> !"COMPILE_ERROR".equalsIgnoreCase(s.getStatus())).count();

            totalPeriodSuccesses += daySuccess;
            totalPeriodCompiles += dayCompilePass;

            double codingSuccessRate = dayTotal > 0 ? Math.round((daySuccess * 100.0 / dayTotal) * 10.0) / 10.0 : 0.0;
            double compilationSuccessRate = dayTotal > 0 ? Math.round((dayCompilePass * 100.0 / dayTotal) * 10.0) / 10.0 : 100.0;

            final LocalDate dateRef = cur;
            long missionsCompletedBeforeOrOnDate = userProgressList.stream()
                    .filter(up -> Boolean.TRUE.equals(up.getCompleted()) && up.getCompletedAt() != null && !up.getCompletedAt().toLocalDate().isAfter(dateRef))
                    .count();
            cumulativeCompleted = (int) Math.max(cumulativeCompleted, missionsCompletedBeforeOrOnDate);

            double masteryAvg = cumulativeCompleted > 0 ? Math.min(100.0, cumulativeCompleted * 20.0) : 0.0;

            trendPoints.add(new PerformanceTrendPointDTO(
                    cur.format(fmt),
                    dayTotal,
                    daySuccess,
                    codingSuccessRate,
                    compilationSuccessRate,
                    cumulativeCompleted,
                    masteryAvg
            ));

            cur = cur.plusDays(1);
        }

        double successRateInPeriod = totalPeriodSubmissions > 0
                ? Math.round((totalPeriodSuccesses * 100.0 / totalPeriodSubmissions) * 10.0) / 10.0
                : 0.0;
        double compileRateInPeriod = totalPeriodSubmissions > 0
                ? Math.round((totalPeriodCompiles * 100.0 / totalPeriodSubmissions) * 10.0) / 10.0
                : 100.0;

        return new PerformanceTrendsResponseDTO(
                validRange,
                trendPoints,
                totalPeriodSubmissions,
                successRateInPeriod,
                compileRateInPeriod,
                !filteredSubmissions.isEmpty()
        );
    }

    /**
     * Phase 5: Real Coding Error Analytics from sandbox submission logs.
     */
    @Transactional(readOnly = true)
    public CodingErrorAnalyticsDTO getCodingErrorAnalytics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found: " + username));

        List<Submission> submissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        List<Mission> allMissions = missionRepository.findAll();

        CodingErrorAnalyticsDTO dto = new CodingErrorAnalyticsDTO();
        int total = submissions.size();
        dto.setTotalSubmissions(total);

        int compileErrors = 0;
        int runtimeErrors = 0;
        int wrongAnswers = 0;
        int successes = 0;

        for (Submission s : submissions) {
            String status = s.getStatus();
            if ("COMPILE_ERROR".equalsIgnoreCase(status)) {
                compileErrors++;
            } else if ("RUNTIME_ERROR".equalsIgnoreCase(status) || "TIMEOUT".equalsIgnoreCase(status)) {
                runtimeErrors++;
            } else if ("WRONG_ANSWER".equalsIgnoreCase(status)) {
                wrongAnswers++;
            } else if ("SUCCESS".equalsIgnoreCase(status)) {
                successes++;
            }
        }

        dto.setCompilationFailures(compileErrors);
        dto.setRuntimeErrors(runtimeErrors);
        dto.setIncorrectOutputs(wrongAnswers);
        dto.setSuccessfulSubmissions(successes);

        dto.setCompilationSuccessRate(total > 0 ? Math.round(((total - compileErrors) * 100.0 / total) * 10.0) / 10.0 : 100.0);
        dto.setTestPassRate(total > 0 ? Math.round((successes * 100.0 / total) * 10.0) / 10.0 : 0.0);

        int firstAttemptPasses = (int) userProgressList.stream()
                .filter(up -> Boolean.TRUE.equals(up.getCompleted()) && (up.getAttempts() == null || up.getAttempts() <= 1))
                .count();
        dto.setFirstAttemptSuccessCount(firstAttemptPasses);
        int completedCount = (int) userProgressList.stream().filter(up -> Boolean.TRUE.equals(up.getCompleted())).count();
        dto.setFirstAttemptSuccessRate(completedCount > 0 ? Math.round((firstAttemptPasses * 100.0 / completedCount) * 10.0) / 10.0 : 0.0);

        // Error categories distribution
        List<CodingErrorAnalyticsDTO.ErrorCategoryItem> categories = new ArrayList<>();
        int totalErrors = compileErrors + runtimeErrors + wrongAnswers;
        if (totalErrors > 0) {
            categories.add(new CodingErrorAnalyticsDTO.ErrorCategoryItem(
                    "Syntax & Compilation (javac)",
                    compileErrors,
                    Math.round((compileErrors * 100.0 / totalErrors) * 10.0) / 10.0
            ));
            categories.add(new CodingErrorAnalyticsDTO.ErrorCategoryItem(
                    "Logic & Output Discrepancy",
                    wrongAnswers,
                    Math.round((wrongAnswers * 100.0 / totalErrors) * 10.0) / 10.0
            ));
            categories.add(new CodingErrorAnalyticsDTO.ErrorCategoryItem(
                    "Runtime Faults & Timeouts",
                    runtimeErrors,
                    Math.round((runtimeErrors * 100.0 / totalErrors) * 10.0) / 10.0
            ));
        }
        dto.setErrorCategories(categories);

        // Challenge failure rates by mission
        List<CodingErrorAnalyticsDTO.ChallengeFailureRateItem> challengeRates = new ArrayList<>();
        for (Mission m : allMissions) {
            List<Submission> missionSubs = submissions.stream()
                    .filter(s -> s.getChallenge() != null && s.getChallenge().getMission() != null && s.getChallenge().getMission().getId().equals(m.getId()))
                    .collect(Collectors.toList());

            if (!missionSubs.isEmpty()) {
                int attempts = missionSubs.size();
                int passes = (int) missionSubs.stream().filter(s -> "SUCCESS".equalsIgnoreCase(s.getStatus())).count();
                int failures = attempts - passes;
                double successRate = Math.round((passes * 100.0 / attempts) * 10.0) / 10.0;
                challengeRates.add(new CodingErrorAnalyticsDTO.ChallengeFailureRateItem(
                        m.getId(),
                        m.getTitle(),
                        m.getJavaConcept(),
                        attempts,
                        failures,
                        successRate
                ));
            }
        }
        dto.setChallengeFailureRates(challengeRates);

        // Concept Failure Rates
        List<CodingErrorAnalyticsDTO.ConceptFailureRateItem> conceptRates = new ArrayList<>();
        for (CodingErrorAnalyticsDTO.ChallengeFailureRateItem c : challengeRates) {
            String dominant = "None";
            if (c.getFailureCount() > 0) {
                dominant = compileErrors >= wrongAnswers ? "Syntax / Semicolons" : "Expected Output Mismatch";
            }
            conceptRates.add(new CodingErrorAnalyticsDTO.ConceptFailureRateItem(
                    "concept-" + c.getMissionId(),
                    c.getJavaConcept(),
                    c.getAttempts(),
                    c.getFailureCount(),
                    Math.round((c.getFailureCount() * 100.0 / c.getAttempts()) * 10.0) / 10.0,
                    dominant
            ));
        }
        dto.setConceptFailureRates(conceptRates);

        // Diagnostic advice derived from real compiler telemetry
        List<String> advice = new ArrayList<>();
        if (compileErrors > 0) {
            advice.add(String.format("Syntax Alert: %d compilation errors detected. Remember to verify closing braces '}' and line termination with ';'.", compileErrors));
        }
        if (wrongAnswers > 0) {
            advice.add(String.format("Output Format Check: %d output mismatches detected. Java terminal tests are strictly case-sensitive and match exact whitespace.", wrongAnswers));
        }
        if (runtimeErrors > 0) {
            advice.add(String.format("Execution Safeguard: %d runtime or timeout events. Inspect infinite while-loops or null references in Solution.java.", runtimeErrors));
        }
        if (advice.isEmpty()) {
            advice.add("All execution logs clean. Clean compiler pipeline maintained across all submissions.");
        }
        dto.setDiagnosticAdvice(advice);

        return dto;
    }

    /**
     * Phase 6: Explainable Rule-Based Personalized Recommendation Engine.
     */
    @Transactional(readOnly = true)
    public List<LearningRecommendationDTO> getPersonalizedRecommendations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found: " + username));

        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        List<Submission> submissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        List<Mission> allMissions = missionRepository.findAll();

        Map<Long, UserProgress> progressMap = userProgressList.stream()
                .collect(Collectors.toMap(up -> up.getMission().getId(), up -> up, (a, b) -> a));

        List<LearningRecommendationDTO> recommendations = new ArrayList<>();

        // Rule 1: High Compilation Failure Rate on a mission
        for (Mission m : allMissions) {
            List<Submission> mSubs = submissions.stream()
                    .filter(s -> s.getChallenge() != null && s.getChallenge().getMission() != null && s.getChallenge().getMission().getId().equals(m.getId()))
                    .collect(Collectors.toList());

            long compileFails = mSubs.stream().filter(s -> "COMPILE_ERROR".equalsIgnoreCase(s.getStatus())).count();
            if (compileFails >= 2) {
                recommendations.add(new LearningRecommendationDTO(
                        "rec-syntax-" + m.getId(),
                        "syntax-drill",
                        m.getJavaConcept(),
                        "Syntax Precision",
                        "SYNTAX_DRILL",
                        "HIGH",
                        String.format("Encountered %d compilation failures on Mission 0%d. Review class structure, main() entrypoint, and semicolon syntax.", compileFails, m.getMissionOrder()),
                        compileFails + " compiler errors logged",
                        m.getId(),
                        m.getTitle(),
                        "Java Codex: Syntax & Class Blueprints",
                        "/mission/" + m.getId(),
                        "Open Mission 0" + m.getMissionOrder() + " Editor",
                        progressMap.containsKey(m.getId()) && Boolean.TRUE.equals(progressMap.get(m.getId()).getCompleted()),
                        "Recent submissions: " + (mSubs.isEmpty() || !"COMPILE_ERROR".equalsIgnoreCase(mSubs.get(0).getStatus()) ? "Syntax resolved" : "Pending resolution")
                ));
            }
        }

        // Rule 2: High Hint Dependency
        for (UserProgress up : userProgressList) {
            if (up.getHintsUsed() != null && up.getHintsUsed() >= 2 && Boolean.TRUE.equals(up.getCompleted())) {
                Mission m = up.getMission();
                recommendations.add(new LearningRecommendationDTO(
                        "rec-hints-" + m.getId(),
                        "hint-reduction",
                        m.getJavaConcept(),
                        "Independent Problem Solving",
                        "HINT_REDUCTION",
                        "MEDIUM",
                        String.format("Used %d sub-space hints on Mission 0%d. Re-solve the challenge independently to unlock full 3-star rating.", up.getHintsUsed(), m.getMissionOrder()),
                        up.getHintsUsed() + " hints unlocked (Max stars capped at 2)",
                        m.getId(),
                        m.getTitle(),
                        "Mission 0" + m.getMissionOrder() + " Replay",
                        "/mission/" + m.getId(),
                        "Replay Mission for 3 Stars",
                        up.getStars() != null && up.getStars() >= 3,
                        "Stars achieved: " + (up.getStars() != null ? up.getStars() : 1) + "/3"
                ));
            }
        }

        // Rule 3: Practice Drills Incomplete on Active Mission
        Optional<Mission> activeUnfinishedMission = allMissions.stream()
                .filter(m -> {
                    UserProgress up = progressMap.get(m.getId());
                    return up == null || !Boolean.TRUE.equals(up.getCompleted());
                })
                .findFirst();

        if (activeUnfinishedMission.isPresent()) {
            Mission nextM = activeUnfinishedMission.get();
            UserProgress up = progressMap.get(nextM.getId());
            boolean practiceDone = up != null && Boolean.TRUE.equals(up.getPracticeCompleted());

            if (!practiceDone) {
                recommendations.add(new LearningRecommendationDTO(
                        "rec-practice-" + nextM.getId(),
                        "practice-prep",
                        nextM.getJavaConcept(),
                        "Knowledge Verification",
                        "PRACTICE_DRILL",
                        "HIGH",
                        String.format("Complete the interactive practice verification drills for %s before writing code.", nextM.getJavaConcept()),
                        "Direct pre-coding checkpoint",
                        nextM.getId(),
                        nextM.getTitle(),
                        "Mission 0" + nextM.getMissionOrder() + " Practice Drills",
                        "/mission/" + nextM.getId(),
                        "Start Practice Drills",
                        false,
                        "Pre-requisite for flight clearance"
                ));
            } else {
                recommendations.add(new LearningRecommendationDTO(
                        "rec-advance-" + nextM.getId(),
                        "next-challenge",
                        nextM.getJavaConcept(),
                        "Curriculum Progression",
                        "CHALLENGE_ADVANCE",
                        "HIGH",
                        String.format("Ready for takeoff: Launch Mission 0%d (%s) to calibrate core starship reactors.", nextM.getMissionOrder(), nextM.getTitle()),
                        "Next sequenced directive in Sector 01",
                        nextM.getId(),
                        nextM.getTitle(),
                        "Mission 0" + nextM.getMissionOrder() + " Coding Challenge",
                        "/mission/" + nextM.getId(),
                        "Launch Mission 0" + nextM.getMissionOrder(),
                        false,
                        "Pending code submission"
                ));
            }
        }

        // Rule 4: General Codex Revision fallback if empty
        if (recommendations.isEmpty() && !allMissions.isEmpty()) {
            Mission m1 = allMissions.get(0);
            recommendations.add(new LearningRecommendationDTO(
                    "rec-codex-basics",
                    "codex-review",
                    "Java Basics & Structure",
                    "Theory Reference",
                    "LOGIC_REVIEW",
                    "LOW",
                    "Explore the Starfleet Java Codex to inspect JVM blueprints, standard library methods, and syntax cheatsheets.",
                    "Active reference library",
                    m1.getId(),
                    m1.getTitle(),
                    "Java Codex Manual",
                    "/codex",
                    "Open Java Codex",
                    false,
                    "Ongoing reference"
            ));
        }

        return recommendations;
    }

    /**
     * Phase 7: Role-Protected Faculty / Commander Class-wide Analytics.
     */
    @Transactional(readOnly = true)
    public FacultyAnalyticsDTO getFacultyAnalytics(String commanderUsername) {
        User commander = userRepository.findByUsername(commanderUsername)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found: " + commanderUsername));

        // Enforce authorization
        if (commander.getRole() != Role.COMMANDER && commander.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Access Denied: Faculty command clearance required (COMMANDER or ADMIN role).");
        }

        List<User> allUsers = userRepository.findAll();
        List<User> cadets = allUsers.stream()
                .filter(u -> u.getRole() == Role.EXPLORER)
                .collect(Collectors.toList());

        List<Submission> allSubmissions = submissionRepository.findAll();
        List<UserProgress> allProgress = userProgressRepository.findAll();
        List<Mission> allMissions = missionRepository.findAll();

        FacultyAnalyticsDTO dto = new FacultyAnalyticsDTO();
        dto.setTotalEnrolledCadets(cadets.size());

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Set<Long> activeUserIds = allSubmissions.stream()
                .filter(s -> s.getSubmittedAt().isAfter(sevenDaysAgo))
                .map(s -> s.getUser().getId())
                .collect(Collectors.toSet());
        dto.setActiveLearnersCount(activeUserIds.size());

        int totalMissionsCleared = (int) allProgress.stream()
                .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                .count();
        dto.setTotalMissionsClearedClasswide(totalMissionsCleared);

        int totalSubs = allSubmissions.size();
        long successfulSubs = allSubmissions.stream()
                .filter(s -> "SUCCESS".equalsIgnoreCase(s.getStatus()))
                .count();
        double classTestSuccessRate = totalSubs > 0
                ? Math.round((successfulSubs * 100.0 / totalSubs) * 10.0) / 10.0
                : 0.0;
        dto.setClassAverageTestSuccessRate(classTestSuccessRate);

        // Class average mastery
        double avgMastery = cadets.isEmpty() ? 0.0 : Math.round(
                (totalMissionsCleared * 20.0 / Math.max(1, cadets.size())) * 10.0
        ) / 10.0;
        dto.setClassAverageMastery(Math.min(100.0, avgMastery));

        // Concept difficulty distributions across all student submissions
        List<FacultyAnalyticsDTO.ClassConceptMasteryItem> conceptDist = new ArrayList<>();
        for (Mission m : allMissions) {
            List<Submission> mSubs = allSubmissions.stream()
                    .filter(s -> s.getChallenge() != null && s.getChallenge().getMission() != null && s.getChallenge().getMission().getId().equals(m.getId()))
                    .collect(Collectors.toList());

            int attempts = mSubs.size();
            long fails = mSubs.stream().filter(s -> !"SUCCESS".equalsIgnoreCase(s.getStatus())).count();
            double failRate = attempts > 0 ? Math.round((fails * 100.0 / attempts) * 10.0) / 10.0 : 0.0;
            double mastery = attempts > 0 ? Math.round(((attempts - fails) * 100.0 / attempts) * 10.0) / 10.0 : 0.0;

            conceptDist.add(new FacultyAnalyticsDTO.ClassConceptMasteryItem(
                    m.getJavaConcept(),
                    mastery,
                    attempts,
                    failRate
            ));
        }
        dto.setConceptDistributions(conceptDist);

        // Challenging missions ranking
        List<FacultyAnalyticsDTO.ChallengingMissionItem> challenging = new ArrayList<>();
        for (Mission m : allMissions) {
            List<UserProgress> missionProgress = allProgress.stream()
                    .filter(up -> up.getMission().getId().equals(m.getId()))
                    .collect(Collectors.toList());

            long completedCount = missionProgress.stream().filter(up -> Boolean.TRUE.equals(up.getCompleted())).count();
            double completionRate = cadets.isEmpty() ? 0.0 : Math.round((completedCount * 100.0 / cadets.size()) * 10.0) / 10.0;
            double avgAttempts = missionProgress.isEmpty() ? 0.0 : Math.round(
                    missionProgress.stream().mapToInt(up -> up.getAttempts() != null ? up.getAttempts() : 0).average().orElse(0.0) * 10.0
            ) / 10.0;

            challenging.add(new FacultyAnalyticsDTO.ChallengingMissionItem(
                    m.getId(),
                    m.getTitle(),
                    m.getJavaConcept(),
                    avgAttempts,
                    completionRate
            ));
        }
        dto.setChallengingMissions(challenging);

        // Cadet Roster
        List<FacultyAnalyticsDTO.CadetRosterItem> roster = new ArrayList<>();
        for (User cadet : cadets) {
            List<Submission> cadetSubs = allSubmissions.stream().filter(s -> s.getUser().getId().equals(cadet.getId())).collect(Collectors.toList());
            long cadetPasses = cadetSubs.stream().filter(s -> "SUCCESS".equalsIgnoreCase(s.getStatus())).count();
            double cadetSuccessRate = cadetSubs.isEmpty() ? 0.0 : Math.round((cadetPasses * 100.0 / cadetSubs.size()) * 10.0) / 10.0;
            long cadetCleared = allProgress.stream().filter(up -> up.getUser().getId().equals(cadet.getId()) && Boolean.TRUE.equals(up.getCompleted())).count();

            roster.add(new FacultyAnalyticsDTO.CadetRosterItem(
                    cadet.getId(),
                    cadet.getUsername(),
                    cadet.getLevel(),
                    cadet.getXp() != null ? cadet.getXp() : 0,
                    (int) cadetCleared,
                    cadetSuccessRate,
                    UserLevelSystem.getRankTitle(cadet.getLevel())
            ));
        }
        dto.setCadetRoster(roster);

        return dto;
    }

    private List<ConceptMasteryDTO> buildEvidenceBasedMasteries(
            Map<Long, UserProgress> progressMap,
            List<Submission> submissions
    ) {
        List<ConceptMasteryDTO> list = new ArrayList<>();

        // 1. Java Basics (Mission 1)
        list.add(calculateConceptEvidence(
                "java-basics",
                "Java Basics",
                "Foundation",
                1L,
                progressMap,
                List.of(
                        "Class declaration & structure",
                        "public static void main entrypoint",
                        "System.out.println console stream",
                        "Semicolon syntax termination"
                ),
                List.of(
                        "Forgetting closing semicolon ';'",
                        "Capitalizing 'system.out.println' incorrectly"
                ),
                submissions
        ));

        // 2. Variables (Mission 2)
        list.add(calculateConceptEvidence(
                "variables",
                "Variables",
                "Memory & State",
                2L,
                progressMap,
                List.of(
                        "Named memory slot allocation",
                        "LowerCamelCase variable naming",
                        "Variable initialization & assignment",
                        "In-place telemetry re-assignment"
                ),
                List.of(
                        "Attempting to re-declare existing variable with type again",
                        "Using uninitialized variable values"
                ),
                submissions
        ));

        // 3. Data Types (Mission 2 reinforcement)
        list.add(calculateConceptEvidence(
                "data-types",
                "Data Types",
                "Type System",
                2L,
                progressMap,
                List.of(
                        "Primitive type sizing (int, double, boolean, char)",
                        "Floating-point vs integer precision",
                        "String literal handling",
                        "Type compatibility & casting"
                ),
                List.of(
                        "Assigning floating point numbers to int without cast",
                        "String quotes vs char single quotes"
                ),
                submissions
        ));

        // 4. Input (Mission 3)
        list.add(calculateConceptEvidence(
                "input",
                "Input",
                "Telemetry IO",
                3L,
                progressMap,
                List.of(
                        "java.util.Scanner import & instantiation",
                        "System.in standard stream binding",
                        "nextLine() text token reading",
                        "nextInt() numerical stream parsing"
                ),
                List.of(
                        "Forgetting to import java.util.Scanner",
                        "Input buffer newline traps after nextInt()"
                ),
                submissions
        ));

        // 5. Operators (Mission 4)
        list.add(calculateConceptEvidence(
                "operators",
                "Operators",
                "Computation",
                4L,
                progressMap,
                List.of(
                        "Arithmetic operators (+, -, *, /, %)",
                        "Integer truncation division pitfalls",
                        "Compound assignments (+=, -=, *=)",
                        "Operator precedence & parenthesis grouping"
                ),
                List.of(
                        "Integer division truncation (e.g. 5 / 2 = 2 instead of 2.5)",
                        "Modulo operator remainder miscalculations"
                ),
                submissions
        ));

        // 6. Conditions (Mission 5 - Boss Mission)
        list.add(calculateConceptEvidence(
                "conditions",
                "Conditions",
                "Control Flow",
                5L,
                progressMap,
                List.of(
                        "Boolean expressions & relational operators (==, !=, <, >)",
                        "Logical AND (&&), OR (||), and NOT (!)",
                        "Multi-branch if-else-if gating",
                        "Reactor emergency threshold interlocks"
                ),
                List.of(
                        "Using single '=' assignment instead of '==' comparison",
                        "Overlapping branch conditions that starve else blocks"
                ),
                submissions
        ));

        // Concepts 7-10: Advanced curriculum (Future worlds / unlocked conditionally)
        list.add(createFutureConcept(
                "loops",
                "Loops",
                "Control Flow",
                progressMap.containsKey(5L) && Boolean.TRUE.equals(progressMap.get(5L).getCompleted()),
                "Sector 03: Cyclic telemetry loops (for, while, do-while) and break/continue control."
        ));

        list.add(createFutureConcept(
                "methods",
                "Methods",
                "Architecture",
                false,
                "Sector 04: Modular subroutines, parameter passing, return signatures, and DRY design."
        ));

        list.add(createFutureConcept(
                "arrays",
                "Arrays",
                "Data Structures",
                false,
                "Sector 05: Fixed-length indexable collections, multidimensional grids, and traversal."
        ));

        list.add(createFutureConcept(
                "oop",
                "OOP",
                "Object Oriented",
                false,
                "Sector 06: Object-Oriented Programming (encapsulation, constructors, inheritance, polymorphism)."
        ));

        return list;
    }

    private ConceptMasteryDTO calculateConceptEvidence(
            String key,
            String name,
            String category,
            Long missionId,
            Map<Long, UserProgress> progressMap,
            List<String> evidencePoints,
            List<String> commonErrors,
            List<Submission> submissions
    ) {
        UserProgress up = progressMap.get(missionId);

        boolean lessonDone = up != null && Boolean.TRUE.equals(up.getLessonCompleted());
        boolean practiceDone = up != null && Boolean.TRUE.equals(up.getPracticeCompleted());
        boolean challengeDone = up != null && Boolean.TRUE.equals(up.getCompleted());
        int attempts = up != null && up.getAttempts() != null ? up.getAttempts() : 0;
        int hintsUsed = up != null && up.getHintsUsed() != null ? up.getHintsUsed() : 0;

        int score = 0;
        if (lessonDone) score += 20;
        if (practiceDone) score += 30;
        if (challengeDone) {
            score += 40;
            if (attempts <= 2 && hintsUsed == 0) {
                score += 10;
            } else if (attempts <= 3 && hintsUsed <= 1) {
                score += 5;
            }
        } else if (attempts > 0) {
            score += Math.min(15, attempts * 5);
        }

        score = Math.min(100, Math.max(0, score));

        String status;
        if (score >= 85) {
            status = "MASTERED";
        } else if (score >= 60) {
            status = "PROFICIENT";
        } else if (attempts > 0 || lessonDone || practiceDone) {
            status = "NEEDS_PRACTICE";
        } else {
            status = (missionId == 1L || (progressMap.containsKey(missionId - 1) && Boolean.TRUE.equals(progressMap.get(missionId - 1).getCompleted())))
                    ? "AVAILABLE"
                    : "LOCKED";
        }

        int practiceAcc = practiceDone ? Math.max(80, 100 - (attempts > 3 ? (attempts - 3) * 5 : 0)) : (lessonDone ? 40 : 0);
        int testsPassed = challengeDone ? 4 : (attempts > 0 ? 1 : 0);
        int totalTests = 4;

        return new ConceptMasteryDTO(
                key,
                name,
                category,
                score,
                status,
                lessonDone,
                practiceDone,
                challengeDone,
                practiceAcc,
                attempts,
                testsPassed,
                totalTests,
                hintsUsed,
                evidencePoints,
                commonErrors
        );
    }

    private ConceptMasteryDTO createFutureConcept(
            String key,
            String name,
            String category,
            boolean isAvailable,
            String summary
    ) {
        return new ConceptMasteryDTO(
                key,
                name,
                category,
                0,
                isAvailable ? "AVAILABLE" : "LOCKED",
                false,
                false,
                false,
                0,
                0,
                0,
                0,
                0,
                List.of(summary),
                List.of()
        );
    }

    private List<String> detectCommonErrors(List<Submission> submissions, List<UserProgress> userProgressList) {
        List<String> errors = new ArrayList<>();
        boolean hasCompileError = false;
        boolean hasWrongAnswer = false;
        boolean hasHighHints = false;

        for (Submission s : submissions) {
            if ("COMPILE_ERROR".equalsIgnoreCase(s.getStatus())) {
                hasCompileError = true;
            } else if ("WRONG_ANSWER".equalsIgnoreCase(s.getStatus())) {
                hasWrongAnswer = true;
            }
        }

        int totalHints = userProgressList.stream()
                .mapToInt(up -> up.getHintsUsed() != null ? up.getHintsUsed() : 0)
                .sum();
        if (totalHints >= 3) {
            hasHighHints = true;
        }

        if (hasCompileError) {
            errors.add("Syntax Slip: Missing semicolon (;) or mismatched brackets in Java class body");
            errors.add("Type Mismatch: Attempting to store incompatible data without casting");
        } else {
            errors.add("Watch out: Java is case-sensitive (e.g. System vs system)");
        }

        if (hasWrongAnswer) {
            errors.add("Logic Deviation: Output string format does not match expected terminal spec exactly");
            errors.add("Integer Division Truncation: Using '/' on two integers drops decimal remainder");
        } else {
            errors.add("Scanner Stream: Remember to consume newline when transitioning from nextInt() to nextLine()");
        }

        if (hasHighHints) {
            errors.add("Hint Dependency: Over-relying on hints before attempting independent problem breakdown");
        }

        return errors;
    }

    private String formatTime(long seconds) {
        if (seconds <= 0) return "0m";
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSecs = seconds % 60;

        if (hours > 0) {
            return String.format("%dh %dm", hours, minutes);
        } else if (minutes > 0) {
            return String.format("%dm %ds", minutes, remainingSecs);
        } else {
            return String.format("%ds", remainingSecs);
        }
    }
}
