package com.codevoyage.submission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.challenge.CodingChallengeRepository;
import com.codevoyage.challenge.TestCase;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private MissionRepository missionRepository;

    @Mock
    private CodingChallengeRepository codingChallengeRepository;

    @Mock
    private ExecutionClient executionClient;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private ProgressService progressService;

    private OutputNormalizer outputNormalizer = new OutputNormalizer();
    private DiagnosticParser diagnosticParser = new DiagnosticParser();

    private SubmissionService submissionService;

    private Mission mission;
    private CodingChallenge challenge;
    private TestCase visibleTest;
    private TestCase hiddenTest;
    private User user;

    @BeforeEach
    void setUp() {
        submissionService = new SubmissionService(
                missionRepository,
                codingChallengeRepository,
                executionClient,
                diagnosticParser,
                outputNormalizer,
                submissionRepository,
                userRepository,
                userProgressRepository,
                progressService
        );

        mission = new Mission();
        mission.setId(1L);
        mission.setTitle("Powering the Console");
        mission.setXpReward(100);

        challenge = new CodingChallenge();
        challenge.setId(10L);
        challenge.setMission(mission);

        visibleTest = new TestCase(challenge, "", "IGNIS STATION: ONLINE\n", "Console handshake check", false);
        visibleTest.setId(101L);

        hiddenTest = new TestCase(challenge, "", "IGNIS STATION: ONLINE\n", "Hidden precision check", true);
        hiddenTest.setId(102L);

        challenge.setTestCases(List.of(visibleTest, hiddenTest));

        user = new User();
        user.setId(5L);
        user.setUsername("cadet_tester");
        user.setXp(0);

        lenient().when(progressService.calculateStars(anyInt(), anyInt())).thenReturn(3);
    }

    @Test
    @DisplayName("Should halt and not run hidden tests if visible tests fail")
    void testVisibleTestFailureHalted() {
        when(missionRepository.findById(1L)).thenReturn(Optional.of(mission));
        when(codingChallengeRepository.findByMissionId(1L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByUsername("cadet_tester")).thenReturn(Optional.of(user));

        // Initial run returns mismatched output
        SandboxExecutionResponse wrongOutput = new SandboxExecutionResponse(true, "SUCCESS", "WRONG OUTPUT\n", "", 200L);
        when(executionClient.execute(anyString(), anyString(), anyString(), anyInt())).thenReturn(wrongOutput);

        SubmissionResultDTO result = submissionService.submitCode(1L, "code", "cadet_tester");

        assertFalse(result.isSuccess());
        assertFalse(result.isCompleted());
        assertEquals("WRONG_ANSWER", result.getStatus());
        assertEquals(0, result.getPassedTests());
        assertEquals(2, result.getTotalTests());

        // Exactly 1 test case returned because hidden tests were NOT executed
        assertEquals(1, result.getTestCases().size());
        TestExecutionResultDTO firstTest = result.getTestCases().get(0);
        assertFalse(firstTest.isPassed());
        assertEquals("IGNIS STATION: ONLINE", firstTest.getExpectedOutput());
        assertEquals("WRONG OUTPUT", firstTest.getActualOutput());

        // ProgressService completeMission must NOT be called on failure
        verify(progressService, never()).completeMission(anyLong(), anyLong(), anyInt(), anyInt(), anyLong());
    }

    @Test
    @DisplayName("Should execute hidden tests when visible tests pass, and strictly mask hidden inputs/outputs")
    void testHiddenTestsExecutedAndMasked() {
        when(missionRepository.findById(1L)).thenReturn(Optional.of(mission));
        when(codingChallengeRepository.findByMissionId(1L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByUsername("cadet_tester")).thenReturn(Optional.of(user));
        when(userProgressRepository.findByUserIdAndMissionId(5L, 1L)).thenReturn(Optional.empty());

        // Sandbox returns matching output
        SandboxExecutionResponse successRun = new SandboxExecutionResponse(true, "SUCCESS", "IGNIS STATION: ONLINE\r\n", "", 250L);
        when(executionClient.execute(anyString(), anyString(), anyString(), anyInt())).thenReturn(successRun);

        SubmissionResultDTO result = submissionService.submitCode(1L, "code", "cadet_tester");

        assertTrue(result.isSuccess());
        assertTrue(result.isCompleted());
        assertEquals("SUCCESS", result.getStatus());
        assertEquals(2, result.getPassedTests());
        assertEquals(2, result.getTotalTests());

        // Verify hidden test masking
        TestExecutionResultDTO hiddenResult = result.getTestCases().get(1);
        assertTrue(hiddenResult.isHidden());
        assertTrue(hiddenResult.isPassed());
        assertNull(hiddenResult.getInput(), "Hidden test input MUST be null");
        assertNull(hiddenResult.getExpectedOutput(), "Hidden test expected output MUST be null");
        assertNull(hiddenResult.getActualOutput(), "Hidden test actual output MUST be null");

        // Awards 100 XP on first completion
        assertEquals(100, result.getXpEarned());
        verify(progressService, times(1)).completeMission(eq(5L), eq(1L), eq(3), eq(100), anyLong());
    }

    @Test
    @DisplayName("Should NOT award XP twice if the challenge was already completed (Retry scenario)")
    void testNoDuplicateXpOnRetry() {
        when(missionRepository.findById(1L)).thenReturn(Optional.of(mission));
        when(codingChallengeRepository.findByMissionId(1L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByUsername("cadet_tester")).thenReturn(Optional.of(user));

        // Simulate existing completed user progress
        UserProgress existingProgress = new UserProgress(user, mission, true);
        existingProgress.setCompleted(true);
        when(userProgressRepository.findByUserIdAndMissionId(5L, 1L)).thenReturn(Optional.of(existingProgress));

        SandboxExecutionResponse successRun = new SandboxExecutionResponse(true, "SUCCESS", "IGNIS STATION: ONLINE\n", "", 200L);
        when(executionClient.execute(anyString(), anyString(), anyString(), anyInt())).thenReturn(successRun);

        SubmissionResultDTO result = submissionService.submitCode(1L, "code", "cadet_tester");

        assertTrue(result.isCompleted());
        // XP earned for this retry must be 0!
        assertEquals(0, result.getXpEarned(), "Must not award XP twice for already completed mission");

        verify(progressService, times(1)).completeMission(eq(5L), eq(1L), eq(3), eq(0), anyLong());
    }
}
