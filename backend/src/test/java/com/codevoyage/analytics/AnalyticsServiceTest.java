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
import com.codevoyage.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private MissionRepository missionRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User cadetUser;
    private User commanderUser;
    private Mission mission1;
    private Mission mission2;
    private CodingChallenge challenge1;
    private CodingChallenge challenge2;

    @BeforeEach
    void setUp() {
        cadetUser = new User();
        cadetUser.setId(10L);
        cadetUser.setUsername("cadet_alex");
        cadetUser.setRole(Role.EXPLORER);
        cadetUser.setXp(250);

        commanderUser = new User();
        commanderUser.setId(1L);
        commanderUser.setUsername("admiral_grace");
        commanderUser.setRole(Role.COMMANDER);
        commanderUser.setXp(5000);

        mission1 = new Mission();
        mission1.setId(1L);
        mission1.setMissionOrder(1);
        mission1.setTitle("Genesis Flight");
        mission1.setJavaConcept("Java Basics & Output");

        challenge1 = new CodingChallenge();
        challenge1.setId(201L);
        challenge1.setMission(mission1);

        mission2 = new Mission();
        mission2.setId(2L);
        mission2.setMissionOrder(2);
        mission2.setTitle("Reactor Variables");
        mission2.setJavaConcept("Variables & Data Types");

        challenge2 = new CodingChallenge();
        challenge2.setId(202L);
        challenge2.setMission(mission2);
    }

    @Test
    @DisplayName("Zero activity student should receive safe empty-state defaults and hasSufficientData=false")
    void testNewStudentZeroDataOverview() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());
        when(submissionRepository.findByUserIdOrderBySubmittedAtDesc(10L)).thenReturn(Collections.emptyList());
        when(missionRepository.findAll()).thenReturn(List.of(mission1, mission2));

        UserAnalyticsDTO analytics = analyticsService.getUserAnalytics("cadet_alex");

        assertNotNull(analytics);
        assertEquals("cadet_alex", analytics.getUsername());
        assertFalse(analytics.isHasSufficientData(), "New student with 0 submissions and 0 progress should have hasSufficientData=false");
        assertEquals(0, analytics.getCompletedMissionsCount());
        assertEquals(0, analytics.getCodingAttempts());
        assertEquals(0.0, analytics.getTestSuccessRate());
        assertEquals(0.0, analytics.getCompilationSuccessRate());
        assertEquals(0, analytics.getActiveConceptMasteryPercentage());
        assertEquals(0, analytics.getFirstAttemptPasses());
    }

    @Test
    @DisplayName("Active student analytics calculates compilation rate, test pass rate, and active mastery accurately")
    void testActiveStudentMetricsCalculation() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));

        UserProgress up1 = new UserProgress();
        up1.setId(501L);
        up1.setUser(cadetUser);
        up1.setMission(mission1);
        up1.setCompleted(true);
        up1.setLessonCompleted(true);
        up1.setPracticeCompleted(true);
        up1.setAttempts(1);
        up1.setHintsUsed(0);
        up1.setStars(3);

        when(userProgressRepository.findByUserId(10L)).thenReturn(List.of(up1));

        Submission subPass = new Submission();
        subPass.setId(601L);
        subPass.setUser(cadetUser);
        subPass.setChallenge(challenge1);
        subPass.setStatus("SUCCESS");
        subPass.setSubmittedAt(LocalDateTime.now().minusDays(1));

        Submission subFail = new Submission();
        subFail.setId(602L);
        subFail.setUser(cadetUser);
        subFail.setChallenge(challenge1);
        subFail.setStatus("COMPILE_ERROR");
        subFail.setSubmittedAt(LocalDateTime.now().minusDays(2));

        when(submissionRepository.findByUserIdOrderBySubmittedAtDesc(10L)).thenReturn(List.of(subPass, subFail));
        when(missionRepository.findAll()).thenReturn(List.of(mission1, mission2));

        UserAnalyticsDTO analytics = analyticsService.getUserAnalytics("cadet_alex");

        assertTrue(analytics.isHasSufficientData());
        assertEquals(1, analytics.getCompletedMissionsCount());
        assertEquals(2, analytics.getCodingAttempts());
        // 1 SUCCESS out of 2 submissions = 50.0% pass rate
        assertEquals(50.0, analytics.getTestSuccessRate(), 0.1);
        // 1 non-COMPILE_ERROR out of 2 submissions = 50.0% compilation rate
        assertEquals(50.0, analytics.getCompilationSuccessRate(), 0.1);
        // First attempt clears = 1 (completed with attempts=1)
        assertEquals(1, analytics.getFirstAttemptPasses());
        // Active mastery should only be computed on attempted concepts (Concept 1), not penalized by non-attempted concepts
        assertTrue(analytics.getActiveConceptMasteryPercentage() > 0);
    }

    @Test
    @DisplayName("Performance trends aggregates historical submissions across date ranges")
    void testPerformanceTrendsDateFiltering() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));

        Submission s1 = new Submission();
        s1.setId(1L);
        s1.setStatus("SUCCESS");
        s1.setSubmittedAt(LocalDateTime.now().minusDays(1));

        Submission s2 = new Submission();
        s2.setId(2L);
        s2.setStatus("FAILED");
        s2.setSubmittedAt(LocalDateTime.now().minusDays(1));

        when(submissionRepository.findByUserIdOrderBySubmittedAtDesc(10L)).thenReturn(List.of(s1, s2));
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());

        PerformanceTrendsResponseDTO trends7d = analyticsService.getPerformanceTrends("cadet_alex", "7d");

        assertNotNull(trends7d);
        assertEquals("7d", trends7d.getRange());
        assertEquals(7, trends7d.getTrendPoints().size(), "7d range should have 7 date points");
        assertEquals(2, trends7d.getTotalSubmissionsInPeriod());
        assertEquals(50.0, trends7d.getSuccessRateInPeriod(), 0.1);
    }

    @Test
    @DisplayName("Coding error analytics categorizes syntax errors, logic errors, and challenge failure rates")
    void testCodingErrorAnalytics() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));

        Submission subCompile = new Submission();
        subCompile.setId(10L);
        subCompile.setChallenge(challenge1);
        subCompile.setStatus("COMPILE_ERROR");
        subCompile.setSubmittedAt(LocalDateTime.now());

        Submission subRuntime = new Submission();
        subRuntime.setId(11L);
        subRuntime.setChallenge(challenge1);
        subRuntime.setStatus("RUNTIME_ERROR");
        subRuntime.setSubmittedAt(LocalDateTime.now());

        Submission subWrong = new Submission();
        subWrong.setId(12L);
        subWrong.setChallenge(challenge1);
        subWrong.setStatus("WRONG_ANSWER");
        subWrong.setSubmittedAt(LocalDateTime.now());

        when(submissionRepository.findByUserIdOrderBySubmittedAtDesc(10L)).thenReturn(List.of(subCompile, subRuntime, subWrong));
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());
        when(missionRepository.findAll()).thenReturn(List.of(mission1));

        CodingErrorAnalyticsDTO errorDto = analyticsService.getCodingErrorAnalytics("cadet_alex");

        assertNotNull(errorDto);
        assertEquals(3, errorDto.getTotalSubmissions());
        assertEquals(1, errorDto.getCompilationFailures());
        assertEquals(1, errorDto.getRuntimeErrors());
        assertEquals(1, errorDto.getIncorrectOutputs());
        assertEquals(3, errorDto.getErrorCategories().size());
        assertEquals(1, errorDto.getChallengeFailureRates().size());
        assertEquals(0.0, errorDto.getChallengeFailureRates().get(0).getSuccessRate(), 0.1);
    }

    @Test
    @DisplayName("Personalized recommendations triggers syntax drill when cadet has multiple compile errors")
    void testRecommendationsSyntaxRule() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));
        when(missionRepository.findAll()).thenReturn(List.of(mission1));
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());

        Submission c1 = new Submission();
        c1.setChallenge(challenge1);
        c1.setStatus("COMPILE_ERROR");
        c1.setSubmittedAt(LocalDateTime.now());

        Submission c2 = new Submission();
        c2.setChallenge(challenge1);
        c2.setStatus("COMPILE_ERROR");
        c2.setSubmittedAt(LocalDateTime.now());

        when(submissionRepository.findByUserIdOrderBySubmittedAtDesc(10L)).thenReturn(List.of(c1, c2));

        List<LearningRecommendationDTO> recs = analyticsService.getPersonalizedRecommendations("cadet_alex");

        assertFalse(recs.isEmpty());
        assertTrue(recs.stream().anyMatch(r -> "SYNTAX_DRILL".equals(r.getType())));
    }

    @Test
    @DisplayName("Faculty analytics rejects unauthorized student cadets and allows COMMANDER")
    void testFacultyAnalyticsAuthorization() {
        when(userRepository.findByUsername("cadet_alex")).thenReturn(Optional.of(cadetUser));
        assertThrows(AccessDeniedException.class, () -> analyticsService.getFacultyAnalytics("cadet_alex"));

        when(userRepository.findByUsername("admiral_grace")).thenReturn(Optional.of(commanderUser));
        when(userRepository.findAll()).thenReturn(List.of(cadetUser, commanderUser));
        when(submissionRepository.findAll()).thenReturn(Collections.emptyList());
        when(userProgressRepository.findAll()).thenReturn(Collections.emptyList());
        when(missionRepository.findAll()).thenReturn(List.of(mission1));

        FacultyAnalyticsDTO facultyDto = analyticsService.getFacultyAnalytics("admiral_grace");
        assertNotNull(facultyDto);
        assertEquals(1, facultyDto.getTotalEnrolledCadets());
        assertEquals(0, facultyDto.getActiveLearnersCount());
    }
}
