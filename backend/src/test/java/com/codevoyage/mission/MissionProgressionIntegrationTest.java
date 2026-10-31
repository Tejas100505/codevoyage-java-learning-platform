package com.codevoyage.mission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.challenge.CodingChallengeRepository;
import com.codevoyage.challenge.TestCase;
import com.codevoyage.execution.DiagnosticParser;
import com.codevoyage.execution.ExecutionClient;
import com.codevoyage.execution.OutputNormalizer;
import com.codevoyage.execution.dto.SandboxExecutionResponse;
import com.codevoyage.progress.ProgressService;
import com.codevoyage.progress.UserProgress;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.submission.SubmissionRepository;
import com.codevoyage.submission.SubmissionService;
import com.codevoyage.submission.dto.SubmissionResultDTO;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import com.codevoyage.world.World;
import com.codevoyage.world.WorldRepository;
import com.codevoyage.world.dto.WorldDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MissionProgressionIntegrationTest {

    @Mock
    private WorldRepository worldRepository;

    @Mock
    private MissionRepository missionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CodingChallengeRepository codingChallengeRepository;

    @Mock
    private ExecutionClient executionClient;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private ProgressService progressService;

    private OutputNormalizer outputNormalizer = new OutputNormalizer();
    private DiagnosticParser diagnosticParser = new DiagnosticParser();

    private MissionService missionService;
    private SubmissionService submissionService;

    private World world1;
    private World world2;
    private World world3;
    private World world4;
    private List<Mission> world1Missions;
    private List<Mission> world2Missions;
    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        missionService = new MissionService(worldRepository, missionRepository, userProgressRepository, userRepository);
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

        world1 = new World();
        world1.setId(1L);
        world1.setWorldOrder(1);
        world1.setName("IGNIS STATION");
        world1.setUnlockedByDefault(true);

        world2 = new World();
        world2.setId(2L);
        world2.setWorldOrder(2);
        world2.setName("KRYON BELT");
        world2.setUnlockedByDefault(false);

        world3 = new World();
        world3.setId(3L);
        world3.setWorldOrder(3);
        world3.setName("NOVA SECTOR");
        world3.setUnlockedByDefault(false);

        world4 = new World();
        world4.setId(4L);
        world4.setWorldOrder(4);
        world4.setName("FUNCTION NEBULA");
        world4.setUnlockedByDefault(false);

        world1Missions = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Mission m = new Mission();
            m.setId((long) i);
            m.setWorld(world1);
            m.setMissionOrder(i);
            m.setTitle("Mission 0" + i);
            m.setXpReward(100);
            if (i > 1) {
                m.setUnlockRequirementMissionId((long) (i - 1));
            }
            world1Missions.add(m);
        }
        world1.setMissions(world1Missions);

        world2Missions = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Mission m = new Mission();
            m.setId((long) (5 + i));
            m.setWorld(world2);
            m.setMissionOrder(i);
            m.setTitle("Kryon 0" + i);
            m.setXpReward(150);
            world2Missions.add(m);
        }
        world2.setMissions(world2Missions);

        user1 = new User();
        user1.setId(10L);
        user1.setUsername("cadet_alpha");
        user1.setCurrentSector(1);
        user1.setXp(0);

        user2 = new User();
        user2.setId(20L);
        user2.setUsername("cadet_beta");
        user2.setCurrentSector(1);
        user2.setXp(0);
    }

    @Test
    @DisplayName("Scenario 1: Completing Mission 1 unlocks Mission 2 via prerequisite rules")
    void testCompletingMission1UnlocksMission2() {
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(worldRepository.findAll()).thenReturn(List.of(world1, world2));

        // Mission 1 is completed
        UserProgress up1 = new UserProgress(user1, world1Missions.get(0), true);
        up1.setCompleted(true);
        up1.setStars(3);

        when(userProgressRepository.findByUserId(10L)).thenReturn(List.of(up1));

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO ignis = worlds.get(0);

        // Mission 1 must be completed and unlocked
        assertTrue(ignis.getMissions().get(0).getCompleted());
        assertTrue(ignis.getMissions().get(0).getUnlocked());

        // Mission 2 must now be unlocked because Mission 1 prerequisite is completed!
        assertTrue(ignis.getMissions().get(1).getUnlocked());
        assertFalse(ignis.getMissions().get(1).getCompleted());

        // Mission 3 must still be locked
        assertFalse(ignis.getMissions().get(2).getUnlocked());
    }

    @Test
    @DisplayName("Scenario 2: Completed Mission 1 remains completed across subsequent fetches")
    void testMission1RemainsCompletedAcrossRefreshes() {
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(worldRepository.findAll()).thenReturn(List.of(world1));

        UserProgress up1 = new UserProgress(user1, world1Missions.get(0), true);
        up1.setCompleted(true);
        up1.setStars(3);
        when(userProgressRepository.findByUserId(10L)).thenReturn(List.of(up1));

        // First fetch
        List<WorldDTO> fetch1 = missionService.getAllWorldsWithProgress("cadet_alpha");
        assertTrue(fetch1.get(0).getMissions().get(0).getCompleted());

        // Simulated subsequent fetch (refresh)
        List<WorldDTO> fetch2 = missionService.getAllWorldsWithProgress("cadet_alpha");
        assertTrue(fetch2.get(0).getMissions().get(0).getCompleted());
        assertEquals(3, fetch2.get(0).getMissions().get(0).getStarsEarned());
    }

    @Test
    @DisplayName("Scenario 3 & 4: Completing all 5 missions produces Cleared: 5/5 and marks World Completed")
    void testCompletingAll5MissionsProducesCleared5Of5() {
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(worldRepository.findAll()).thenReturn(List.of(world1));

        List<UserProgress> all5Progress = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            up.setStars(3);
            all5Progress.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(all5Progress);

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO ignis = worlds.get(0);

        assertTrue(ignis.getCompleted());
        assertEquals(5, ignis.getClearedMissionsCount());
        assertEquals(5, ignis.getTotalMissionsCount());
    }

    @Test
    @DisplayName("Scenario 5 & 6: All five missions remain permanently unlocked for replay after world completion")
    void testAllMissionsRemainUnlockedAfterWorldCompletion() {
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(worldRepository.findAll()).thenReturn(List.of(world1));

        List<UserProgress> all5Progress = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            up.setStars(3);
            all5Progress.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(all5Progress);

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO ignis = worlds.get(0);

        // Every mission must be unlocked and completed
        for (int i = 0; i < 5; i++) {
            assertTrue(ignis.getMissions().get(i).getUnlocked(), "Mission " + (i + 1) + " must remain unlocked");
            assertTrue(ignis.getMissions().get(i).getCompleted(), "Mission " + (i + 1) + " must remain completed");
        }
    }

    @Test
    @DisplayName("Scenario 7: A failed replay does not erase existing completion")
    void testFailedReplayDoesNotEraseCompletion() {
        CodingChallenge challenge = new CodingChallenge();
        challenge.setId(10L);
        challenge.setMission(world1Missions.get(1)); // Mission 2

        TestCase tc = new TestCase(challenge, "", "EXPECTED", "Test check", false);
        challenge.setTestCases(List.of(tc));

        when(missionRepository.findById(2L)).thenReturn(Optional.of(world1Missions.get(1)));
        when(codingChallengeRepository.findByMissionId(2L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // Existing progress is already completed
        UserProgress existingProgress = new UserProgress(user1, world1Missions.get(1), true);
        existingProgress.setCompleted(true);
        existingProgress.setStars(3);

        // Mock failed sandbox execution
        SandboxExecutionResponse failedResponse = new SandboxExecutionResponse(false, "WRONG_ANSWER", "WRONG", "", 120L);
        when(executionClient.execute(any(), any(), any(), any())).thenReturn(failedResponse);

        // Submit failed code
        SubmissionResultDTO result = submissionService.submitCode(2L, "bad code", "cadet_alpha");

        assertFalse(result.isCompleted());
        // Verify completeMission was NEVER called with false or reset
        verify(progressService, never()).completeMission(eq(10L), eq(2L), anyInt(), anyInt(), anyLong());
        // Verify existing completion was not erased
        assertTrue(existingProgress.getCompleted());
    }

    @Test
    @DisplayName("Scenario 8: A successful replay does not award duplicate completion XP")
    void testSuccessfulReplayDoesNotAwardDuplicateXP() {
        CodingChallenge challenge = new CodingChallenge();
        challenge.setId(10L);
        challenge.setMission(world1Missions.get(1)); // Mission 2 with 100 XP
        challenge.getMission().setXpReward(100);

        TestCase tc = new TestCase(challenge, "", "MATCH\n", "Test check", false);
        challenge.setTestCases(List.of(tc));

        when(missionRepository.findById(2L)).thenReturn(Optional.of(world1Missions.get(1)));
        when(codingChallengeRepository.findByMissionId(2L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // Already completed in userProgressRepository
        UserProgress existingProgress = new UserProgress(user1, world1Missions.get(1), true);
        existingProgress.setCompleted(true);
        existingProgress.setStars(3);
        when(userProgressRepository.findByUserIdAndMissionId(10L, 2L)).thenReturn(Optional.of(existingProgress));

        // Sandbox execution passes
        SandboxExecutionResponse passResponse = new SandboxExecutionResponse(true, "SUCCESS", "MATCH\n", "", 80L);
        when(executionClient.execute(any(), any(), any(), any())).thenReturn(passResponse);

        // Submit replay
        SubmissionResultDTO result = submissionService.submitCode(2L, "valid code", "cadet_alpha");

        assertTrue(result.isCompleted());
        // Replay XP earned must be 0 (no duplicate XP!)
        assertEquals(0, result.getXpEarned());
        // completeMission called with 0 XP
        verify(progressService).completeMission(eq(10L), eq(2L), anyInt(), eq(0), anyLong());
    }

    @Test
    @DisplayName("Scenario 9: Different users have independent mission progress")
    void testDifferentUsersHaveIndependentProgress() {
        when(worldRepository.findAll()).thenReturn(List.of(world1));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(userRepository.findByUsername("cadet_beta")).thenReturn(Optional.of(user2));

        // User 1 completed all 5 missions
        List<UserProgress> user1Progress = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            user1Progress.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(user1Progress);

        // User 2 has completed 0 missions
        when(userProgressRepository.findByUserId(20L)).thenReturn(Collections.emptyList());

        // Check user 1
        WorldDTO user1World = missionService.getAllWorldsWithProgress("cadet_alpha").get(0);
        assertTrue(user1World.getCompleted());
        assertEquals(5, user1World.getClearedMissionsCount());

        // Check user 2
        WorldDTO user2World = missionService.getAllWorldsWithProgress("cadet_beta").get(0);
        assertFalse(user2World.getCompleted());
        assertEquals(0, user2World.getClearedMissionsCount());
        // User 2 mission 1 is unlocked by default, but missions 2-5 are locked
        assertTrue(user2World.getMissions().get(0).getUnlocked());
        assertFalse(user2World.getMissions().get(1).getUnlocked());
    }

    @Test
    @DisplayName("Scenario 11: World completion is correctly calculated from persisted records")
    void testWorldCompletionCalculatedFromPersistedRecords() {
        when(worldRepository.findAll()).thenReturn(List.of(world1));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // Only 4 of 5 missions completed
        List<UserProgress> user1Progress = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            user1Progress.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(user1Progress);

        WorldDTO world = missionService.getAllWorldsWithProgress("cadet_alpha").get(0);
        assertFalse(world.getCompleted());
        assertEquals(4, world.getClearedMissionsCount());
        assertEquals(5, world.getTotalMissionsCount());

        // Now add 5th mission
        UserProgress up5 = new UserProgress(user1, world1Missions.get(4), true);
        up5.setCompleted(true);
        user1Progress.add(up5);

        WorldDTO worldAfter5 = missionService.getAllWorldsWithProgress("cadet_alpha").get(0);
        assertTrue(worldAfter5.getCompleted());
        assertEquals(5, worldAfter5.getClearedMissionsCount());
    }

    @Test
    @DisplayName("Scenario 6: World 2 automatically unlocks when all 5 World 1 missions are completed")
    void testWorld2UnlocksWhenAll5World1MissionsCompleted() {
        when(worldRepository.findAll()).thenReturn(List.of(world1, world2));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // User starts at currentSector = 1
        user1.setCurrentSector(1);

        // All 5 World 1 missions completed
        List<UserProgress> all5 = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            all5.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(all5);

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        assertEquals(2, worlds.size());

        WorldDTO w1 = worlds.get(0);
        WorldDTO w2 = worlds.get(1);

        assertTrue(w1.getCompleted(), "World 1 must be marked completed");
        assertEquals(5, w1.getClearedMissionsCount());

        // World 2 MUST be unlocked!
        assertTrue(w2.getUnlocked(), "World 2 must be unlocked after World 1 completes");
        // User sector must be self-healed to at least 2
        assertEquals(2, user1.getCurrentSector());
    }

    @Test
    @DisplayName("Scenario 11: Replaying any World 1 mission after World 2 is unlocked does not lock World 2")
    void testReplayDoesNotRevokeWorld2Unlock() {
        when(worldRepository.findAll()).thenReturn(List.of(world1, world2));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        user1.setCurrentSector(2);

        List<UserProgress> all5 = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up = new UserProgress(user1, world1Missions.get(i), true);
            up.setCompleted(true);
            all5.add(up);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(all5);

        // Replay mission 1
        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO w1 = worlds.get(0);
        WorldDTO w2 = worlds.get(1);

        assertTrue(w1.getCompleted());
        assertTrue(w2.getUnlocked());
        assertTrue(w1.getMissions().get(0).getCompleted());
        assertTrue(w1.getMissions().get(0).getUnlocked());
    }

    @Test
    @DisplayName("Scenario 12: Correct locked behavior: uncompleted missions with unmet prerequisites remain locked")
    void testLockedMissionsRemainLockedWhenPrerequisitesUnmet() {
        when(worldRepository.findAll()).thenReturn(List.of(world1));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // Only Mission 1 completed
        UserProgress up1 = new UserProgress(user1, world1Missions.get(0), true);
        up1.setCompleted(true);
        when(userProgressRepository.findByUserId(10L)).thenReturn(List.of(up1));

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO w1 = worlds.get(0);

        assertTrue(w1.getMissions().get(0).getCompleted());
        assertTrue(w1.getMissions().get(0).getUnlocked());

        // Mission 2 is unlocked (prereq satisfied) but NOT completed
        assertTrue(w1.getMissions().get(1).getUnlocked());
        assertFalse(w1.getMissions().get(1).getCompleted());

        // Missions 3, 4, 5 MUST remain locked
        assertFalse(w1.getMissions().get(2).getUnlocked(), "Mission 3 must remain locked");
        assertFalse(w1.getMissions().get(3).getUnlocked(), "Mission 4 must remain locked");
        assertFalse(w1.getMissions().get(4).getUnlocked(), "Mission 5 must remain locked");
    }

    @Test
    @DisplayName("Scenario 13: Each locked world displays its accurate unmet prerequisite message")
    void testLockedWorldsDisplaySpecificUnlockRequirements() {
        when(worldRepository.findAll()).thenReturn(List.of(world1, world2, world3, world4));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // User at Sector 1, 0 completions
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        assertEquals(4, worlds.size());

        WorldDTO w1 = worlds.get(0);
        WorldDTO w2 = worlds.get(1);
        WorldDTO w3 = worlds.get(2);
        WorldDTO w4 = worlds.get(3);

        // World 1 is unlocked by default
        assertTrue(w1.getUnlocked());

        // World 2 requires World 1
        assertFalse(w2.getUnlocked());
        assertEquals("IGNIS STATION", w2.getRequiredWorldName());
        assertEquals(1, w2.getRequiredWorldOrder());
        assertTrue(w2.getUnlockRequirementText().contains("IGNIS STATION"));
        assertTrue(w2.getUnlockRequirementText().contains("KRYON BELT"));

        // World 3 requires World 2
        assertFalse(w3.getUnlocked());
        assertEquals("KRYON BELT", w3.getRequiredWorldName());
        assertEquals(2, w3.getRequiredWorldOrder());
        assertTrue(w3.getUnlockRequirementText().contains("KRYON BELT"));
        assertTrue(w3.getUnlockRequirementText().contains("NOVA SECTOR"));

        // World 4 requires World 3
        assertFalse(w4.getUnlocked());
        assertEquals("NOVA SECTOR", w4.getRequiredWorldName());
        assertEquals(3, w4.getRequiredWorldOrder());
        assertTrue(w4.getUnlockRequirementText().contains("NOVA SECTOR"));
        assertTrue(w4.getUnlockRequirementText().contains("FUNCTION NEBULA"));
    }

    @Test
    @DisplayName("Scenario 14: Completing World 2 unlocks World 3 sequentially")
    void testLaterWorldCompletionUnlocksNextWorld() {
        when(worldRepository.findAll()).thenReturn(List.of(world1, world2, world3));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));

        // User completed all 5 of World 1 and all 5 of World 2
        List<UserProgress> completions = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserProgress up1 = new UserProgress(user1, world1Missions.get(i), true);
            up1.setCompleted(true);
            completions.add(up1);

            UserProgress up2 = new UserProgress(user1, world2Missions.get(i), true);
            up2.setCompleted(true);
            completions.add(up2);
        }
        when(userProgressRepository.findByUserId(10L)).thenReturn(completions);

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        assertEquals(3, worlds.size());

        WorldDTO w1 = worlds.get(0);
        WorldDTO w2 = worlds.get(1);
        WorldDTO w3 = worlds.get(2);

        assertTrue(w1.getCompleted());
        assertTrue(w2.getCompleted());
        assertTrue(w3.getUnlocked(), "World 3 must unlock when World 2 is completed");
        assertEquals(3, user1.getCurrentSector());
    }

    @Test
    @DisplayName("Scenario 15: A world with 0 configured missions is never considered completed automatically")
    void testEmptyWorldIsNeverCompletedAutomatically() {
        World emptyWorld = new World();
        emptyWorld.setId(99L);
        emptyWorld.setWorldOrder(5);
        emptyWorld.setName("EMPTY SECTOR");
        emptyWorld.setMissions(Collections.emptyList());

        when(worldRepository.findAll()).thenReturn(List.of(world1, emptyWorld));
        when(userRepository.findByUsername("cadet_alpha")).thenReturn(Optional.of(user1));
        when(userProgressRepository.findByUserId(10L)).thenReturn(Collections.emptyList());

        List<WorldDTO> worlds = missionService.getAllWorldsWithProgress("cadet_alpha");
        WorldDTO emptyDTO = worlds.stream().filter(w -> w.getId().equals(99L)).findFirst().orElseThrow();

        assertFalse(emptyDTO.getCompleted(), "A world with zero configured missions must not be treated as completed");
        assertEquals(0, emptyDTO.getClearedMissionsCount());
        assertEquals(0, emptyDTO.getTotalMissionsCount());
    }
}
