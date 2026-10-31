package com.codevoyage.mission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.challenge.TestCase;
import com.codevoyage.challenge.dto.CodingChallengeDTO;
import com.codevoyage.challenge.dto.HintDTO;
import com.codevoyage.challenge.dto.TestCaseDTO;
import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.lesson.dto.LessonDTO;
import com.codevoyage.mission.dto.MissionDetailDTO;
import com.codevoyage.mission.dto.MissionSummaryDTO;
import com.codevoyage.practice.dto.PracticeQuestionDTO;
import com.codevoyage.progress.UserProgress;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import com.codevoyage.world.World;
import com.codevoyage.world.WorldRepository;
import com.codevoyage.world.dto.WorldDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MissionService {

    private final WorldRepository worldRepository;
    private final MissionRepository missionRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    public MissionService(
            WorldRepository worldRepository,
            MissionRepository missionRepository,
            UserProgressRepository userProgressRepository,
            UserRepository userRepository
    ) {
        this.worldRepository = worldRepository;
        this.missionRepository = missionRepository;
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<WorldDTO> getAllWorldsWithProgress(String username) {
        User user = (username != null) ? userRepository.findByUsername(username).orElse(null) : null;
        Map<Long, UserProgress> progressMap = new HashMap<>();

        if (user != null) {
            userProgressRepository.findByUserId(user.getId())
                    .forEach(up -> {
                        if (up.getMission() != null) {
                            progressMap.put(up.getMission().getId(), up);
                        }
                    });
        }

        List<World> worlds = worldRepository.findAll().stream()
                .sorted(Comparator.comparingInt(World::getWorldOrder))
                .collect(Collectors.toList());

        List<WorldDTO> result = new ArrayList<>();
        boolean previousWorldCompleted = true; // World 1 is always unlocked by default

        for (World world : worlds) {
            World prevWorld = (world.getWorldOrder() != null && world.getWorldOrder() > 1)
                    ? worlds.stream().filter(w -> w.getWorldOrder() != null && w.getWorldOrder() == world.getWorldOrder() - 1).findFirst().orElse(null)
                    : null;

            boolean isWorldUnlocked = (world.getWorldOrder() != null && world.getWorldOrder() == 1)
                    || Boolean.TRUE.equals(world.getUnlockedByDefault())
                    || (user != null && user.getCurrentSector() != null && user.getCurrentSector() >= world.getWorldOrder())
                    || previousWorldCompleted;

            // Self-heal user currentSector if previous world is completed
            if (previousWorldCompleted && user != null && (user.getCurrentSector() == null || user.getCurrentSector() < world.getWorldOrder())) {
                user.setCurrentSector(world.getWorldOrder());
                userRepository.save(user);
            }

            WorldDTO dto = mapWorldToDTO(world, progressMap, user, isWorldUnlocked);

            // Populate contextual unlock prerequisite metadata
            if (prevWorld != null) {
                dto.setRequiredWorldOrder(prevWorld.getWorldOrder());
                dto.setRequiredWorldName(prevWorld.getName());
                dto.setUnlockRequirementText("Complete all required missions in " + prevWorld.getName() + " to unlock " + world.getName() + ".");
            } else {
                dto.setUnlockRequirementText("Initial Sector: Available by default.");
            }

            result.add(dto);

            // Update for next world in sequence: requires totalMissionsCount > 0 and all completed
            previousWorldCompleted = Boolean.TRUE.equals(dto.getCompleted());
        }

        return result;
    }

    public MissionDetailDTO getMissionDetails(Long missionId, String username) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Mission not found with id: " + missionId));

        User user = (username != null) ? userRepository.findByUsername(username).orElse(null) : null;
        UserProgress userProgress = null;

        if (user != null) {
            userProgress = userProgressRepository.findByUserIdAndMissionId(user.getId(), mission.getId())
                    .orElse(null);
        }

        return mapMissionToDetailDTO(mission, userProgress, user);
    }

    private WorldDTO mapWorldToDTO(World world, Map<Long, UserProgress> progressMap, User user, boolean isWorldUnlocked) {
        List<Mission> missions = world.getMissions() != null ? world.getMissions().stream()
                .sorted(Comparator.comparingInt(Mission::getMissionOrder))
                .collect(Collectors.toList()) : Collections.emptyList();

        long totalMissionsCount = missions.size();
        long completedCount = missions.stream()
                .filter(m -> {
                    UserProgress up = progressMap.get(m.getId());
                    return up != null && Boolean.TRUE.equals(up.getCompleted());
                })
                .count();

        boolean isWorldCompleted = totalMissionsCount > 0 && completedCount >= totalMissionsCount;

        List<MissionSummaryDTO> missionDTOs = missions.stream()
                .map(m -> {
                    UserProgress up = progressMap.get(m.getId());
                    boolean isCompleted = up != null && Boolean.TRUE.equals(up.getCompleted());
                    int stars = up != null && up.getStars() != null ? up.getStars() : 0;

                    // Prerequisite evaluation
                    boolean prerequisiteSatisfied = false;
                    if (m.getMissionOrder() == 1) {
                        prerequisiteSatisfied = isWorldUnlocked;
                    } else if (m.getUnlockRequirementMissionId() != null) {
                        UserProgress prereqProgress = progressMap.get(m.getUnlockRequirementMissionId());
                        prerequisiteSatisfied = prereqProgress != null && Boolean.TRUE.equals(prereqProgress.getCompleted());
                    } else {
                        int prevOrder = m.getMissionOrder() - 1;
                        prerequisiteSatisfied = missions.stream()
                                .filter(pm -> pm.getMissionOrder() == prevOrder)
                                .findFirst()
                                .map(pm -> {
                                    UserProgress prevUp = progressMap.get(pm.getId());
                                    return prevUp != null && Boolean.TRUE.equals(prevUp.getCompleted());
                                })
                                .orElse(false);
                    }

                    // A mission is unlocked if:
                    // 1) The entire world is completed (permanent replay access for all missions in world)
                    // 2) The mission itself is already completed
                    // 3) Up has unlocked == true
                    // 4) Its prerequisite mission in the sequence is completed
                    // 5) It's mission 1 of an unlocked world
                    boolean isUnlocked = isWorldCompleted
                            || isCompleted
                            || (up != null && Boolean.TRUE.equals(up.getUnlocked()))
                            || prerequisiteSatisfied;

                    return new MissionSummaryDTO(
                            m.getId(),
                            m.getMissionOrder(),
                            m.getTitle(),
                            m.getSlug(),
                            m.getObjective(),
                            m.getJavaConcept(),
                            m.getXpReward(),
                            m.getStarsReward(),
                            m.getDifficulty(),
                            isUnlocked,
                            isCompleted,
                            stars
                    );
                })
                .collect(Collectors.toList());

        WorldDTO worldDTO = new WorldDTO(
                world.getId(),
                world.getWorldOrder(),
                world.getSlug(),
                world.getName(),
                world.getTheme(),
                world.getLore(),
                world.getUnlockedByDefault(),
                missionDTOs
        );
        worldDTO.setUnlocked(isWorldUnlocked);
        worldDTO.setCompleted(isWorldCompleted);
        worldDTO.setClearedMissionsCount((int) completedCount);
        worldDTO.setTotalMissionsCount((int) totalMissionsCount);
        return worldDTO;
    }

    private MissionDetailDTO mapMissionToDetailDTO(Mission mission, UserProgress progress, User user) {
        MissionDetailDTO dto = new MissionDetailDTO();
        dto.setId(mission.getId());
        dto.setWorldId(mission.getWorld().getId());
        dto.setWorldName(mission.getWorld().getName());
        dto.setMissionOrder(mission.getMissionOrder());
        dto.setTitle(mission.getTitle());
        dto.setSlug(mission.getSlug());
        dto.setStory(mission.getStory());
        dto.setObjective(mission.getObjective());
        dto.setJavaConcept(mission.getJavaConcept());
        dto.setShipSystem(mission.getShipSystem());
        dto.setXpReward(mission.getXpReward());
        dto.setStarsReward(mission.getStarsReward());
        dto.setDifficulty(mission.getDifficulty());
        dto.setIsBossMission(Boolean.TRUE.equals(mission.getIsBossMission()));
        dto.setUnlockRequirementMissionId(mission.getUnlockRequirementMissionId());

        boolean isWorldUnlocked = (mission.getWorld().getWorldOrder() == 1)
                || Boolean.TRUE.equals(mission.getWorld().getUnlockedByDefault())
                || (user != null && user.getCurrentSector() != null && user.getCurrentSector() >= mission.getWorld().getWorldOrder());

        if (!isWorldUnlocked && user != null && mission.getWorld().getWorldOrder() > 1) {
            int prevWorldOrder = mission.getWorld().getWorldOrder() - 1;
            World prevWorld = worldRepository.findAll().stream()
                    .filter(w -> w.getWorldOrder() == prevWorldOrder)
                    .findFirst()
                    .orElse(null);
            if (prevWorld != null) {
                List<Mission> prevMissions = missionRepository.findByWorldIdOrderByMissionOrderAsc(prevWorld.getId());
                long prevCompleted = userProgressRepository.findByUserId(user.getId()).stream()
                        .filter(up -> up.getMission() != null && up.getMission().getWorld() != null && up.getMission().getWorld().getId().equals(prevWorld.getId()))
                        .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                        .count();
                if (!prevMissions.isEmpty() && prevCompleted >= prevMissions.size()) {
                    isWorldUnlocked = true;
                }
            }
        }

        boolean isCompleted = progress != null && Boolean.TRUE.equals(progress.getCompleted());

        // Check if all missions in this world are completed
        boolean isWorldCompleted = false;
        if (user != null && mission.getWorld() != null) {
            List<Mission> worldMissions = missionRepository.findByWorldIdOrderByMissionOrderAsc(mission.getWorld().getId());
            long completedInWorld = userProgressRepository.findByUserId(user.getId()).stream()
                    .filter(up -> up.getMission() != null && up.getMission().getWorld() != null && up.getMission().getWorld().getId().equals(mission.getWorld().getId()))
                    .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                    .count();
            isWorldCompleted = !worldMissions.isEmpty() && completedInWorld >= worldMissions.size();
        }

        boolean prerequisiteSatisfied = false;
        if (mission.getMissionOrder() == 1) {
            prerequisiteSatisfied = isWorldUnlocked;
        } else if (mission.getUnlockRequirementMissionId() != null && user != null) {
            prerequisiteSatisfied = userProgressRepository.findByUserIdAndMissionId(user.getId(), mission.getUnlockRequirementMissionId())
                    .map(up -> Boolean.TRUE.equals(up.getCompleted()))
                    .orElse(false);
        } else if (user != null) {
            int prevOrder = mission.getMissionOrder() - 1;
            prerequisiteSatisfied = missionRepository.findByWorldIdOrderByMissionOrderAsc(mission.getWorld().getId()).stream()
                    .filter(pm -> pm.getMissionOrder() == prevOrder)
                    .findFirst()
                    .flatMap(pm -> userProgressRepository.findByUserIdAndMissionId(user.getId(), pm.getId()))
                    .map(up -> Boolean.TRUE.equals(up.getCompleted()))
                    .orElse(false);
        }

        boolean unlocked = isWorldCompleted
                || isCompleted
                || (progress != null && Boolean.TRUE.equals(progress.getUnlocked()))
                || prerequisiteSatisfied;

        dto.setUnlocked(unlocked);
        dto.setCompleted(isCompleted);
        dto.setStarsEarned(progress != null && progress.getStars() != null ? progress.getStars() : 0);
        dto.setAttempts(progress != null && progress.getAttempts() != null ? progress.getAttempts() : 0);
        dto.setHintsUsed(progress != null && progress.getHintsUsed() != null ? progress.getHintsUsed() : 0);

        // Map Lesson
        if (mission.getLesson() != null) {
            LessonDTO lDto = new LessonDTO(
                    mission.getLesson().getId(),
                    mission.getLesson().getTitle(),
                    mission.getLesson().getConceptSummary(),
                    mission.getLesson().getDetailedExplanation(),
                    mission.getLesson().getSampleJavaCode(),
                    mission.getLesson().getKeyTakeaways()
            );
            lDto.setWhyNeeded(mission.getLesson().getWhyNeeded());
            lDto.setVisualRepJson(mission.getLesson().getVisualRepJson());
            lDto.setSyntaxBreakdownJson(mission.getLesson().getSyntaxBreakdownJson());
            lDto.setCommonMistakesJson(mission.getLesson().getCommonMistakesJson());
            lDto.setInteractiveSnippet(mission.getLesson().getInteractiveSnippet());
            lDto.setInteractiveOptionsJson(mission.getLesson().getInteractiveOptionsJson());
            dto.setLesson(lDto);
        }

        // Map Practice Questions
        if (mission.getPracticeQuestions() != null) {
            dto.setPracticeQuestions(mission.getPracticeQuestions().stream()
                    .map(pq -> {
                        PracticeQuestionDTO qDto = new PracticeQuestionDTO(
                                pq.getId(),
                                pq.getQuestionNumber(),
                                pq.getPrompt(),
                                pq.getCodeSnippet(),
                                pq.getOptionsJson(),
                                pq.getCorrectAnswerIndex(),
                                pq.getExplanation()
                        );
                        qDto.setActivityType(pq.getActivityType() != null ? pq.getActivityType() : "MULTIPLE_CHOICE");
                        qDto.setActivityDataJson(pq.getActivityDataJson());
                        qDto.setHint(pq.getHint());
                        return qDto;
                    })
                    .collect(Collectors.toList()));
        }

        // Map Coding Challenge (STRICT SECURITY RULE: EXCLUDE HIDDEN TEST CASES)
        if (mission.getCodingChallenge() != null) {
            CodingChallenge cc = mission.getCodingChallenge();

            // Filter ONLY visible tests
            List<TestCaseDTO> visibleTests = cc.getTestCases().stream()
                    .filter(tc -> !Boolean.TRUE.equals(tc.getHidden()))
                    .map(tc -> new TestCaseDTO(tc.getId(), tc.getInput(), tc.getExpectedOutput(), tc.getDescription()))
                    .collect(Collectors.toList());

            List<HintDTO> hintDTOs = cc.getHints().stream()
                    .map(h -> new HintDTO(h.getId(), h.getHintOrder(), h.getContent(), h.getXpPenalty()))
                    .collect(Collectors.toList());

            dto.setCodingChallenge(new CodingChallengeDTO(
                    cc.getId(),
                    cc.getTitle(),
                    cc.getInstructions(),
                    cc.getStarterCode(),
                    cc.getMethodSignature(),
                    visibleTests,
                    hintDTOs
            ));
        }

        return dto;
    }
}
