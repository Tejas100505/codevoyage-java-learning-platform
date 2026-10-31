package com.codevoyage.progress;

import com.codevoyage.mission.Mission;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.dto.UserProgressDTO;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.codevoyage.achievement.Achievement;
import com.codevoyage.achievement.AchievementRepository;
import com.codevoyage.achievement.UserAchievement;
import com.codevoyage.achievement.UserAchievementRepository;
import com.codevoyage.world.World;
import com.codevoyage.world.WorldRepository;
import com.codevoyage.user.UserLevelSystem;

@Service
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final WorldRepository worldRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public ProgressService(
            UserProgressRepository userProgressRepository,
            UserRepository userRepository,
            MissionRepository missionRepository,
            WorldRepository worldRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository
    ) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.missionRepository = missionRepository;
        this.worldRepository = worldRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Transactional(readOnly = true)
    public List<UserProgressDTO> getUserProgress(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();

        return userProgressRepository.findByUserId(user.getId()).stream()
                .map(up -> new UserProgressDTO(
                        up.getMission().getId(),
                        up.getMission().getTitle(),
                        up.getUnlocked(),
                        up.getCompleted(),
                        up.getAttempts(),
                        up.getStars(),
                        up.getXpEarned(),
                        up.getHintsUsed(),
                        up.getCompletionTimeSeconds(),
                        up.getCompletedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Compute authoritative Java Skill Tree with actual user mastery and completion stats.
     */
    @Transactional(readOnly = true)
    public List<com.codevoyage.progress.dto.SkillTreeNodeDTO> getSkillTreeNodes(String username) {
        User user = (username != null) ? userRepository.findByUsername(username).orElse(null) : null;
        Long userId = (user != null) ? user.getId() : -1L;

        List<UserProgress> progressList = (userId > 0) ? userProgressRepository.findByUserId(userId) : List.of();
        java.util.Map<Long, UserProgress> progressMap = progressList.stream()
                .collect(Collectors.toMap(up -> up.getMission().getId(), up -> up, (a, b) -> a));

        UserProgress p1 = progressMap.get(1L);
        UserProgress p2 = progressMap.get(2L);
        UserProgress p3 = progressMap.get(3L);
        UserProgress p4 = progressMap.get(4L);
        UserProgress p5 = progressMap.get(5L);

        // Node 1: JAVA FOUNDATION (Root)
        boolean rootMastered = p1 != null && Boolean.TRUE.equals(p1.getCompleted());
        String rootState = rootMastered ? "MASTERED" : (p1 != null && p1.getAttempts() > 0 ? "IN_PROGRESS" : "AVAILABLE");
        int rootMastery = rootMastered ? 100 : (p1 != null && Boolean.TRUE.equals(p1.getLessonCompleted()) ? 50 : 20);

        var nodeRoot = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "foundation",
                "Java Foundation",
                "Core Architecture",
                rootState,
                rootMastery,
                "Essential program structure, class declaration, and JVM main method.",
                "Learned class blueprints, public static void main entrypoints, and standard syntax.",
                p1 != null && Boolean.TRUE.equals(p1.getCompleted()) ? List.of("Mission 01: System Initialization") : List.of(),
                List.of("Flight Diagnostics Beacon: Transmit 'IGNIS STATION ONLINE'"),
                "java-basics",
                1L,
                List.of()
        );

        // Node 2: OUTPUT (Branch from Foundation)
        boolean outMastered = p1 != null && Boolean.TRUE.equals(p1.getCompleted());
        String outState = outMastered ? "MASTERED" : "AVAILABLE";
        var nodeOutput = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "output",
                "Console Output",
                "Telemetry IO",
                outState,
                outMastered ? 100 : 0,
                "Printing text streams via System.out.print() and System.out.println().",
                "Learned difference between print (same line) and println (line carriage feed).",
                outMastered ? List.of("Mission 01: System Initialization") : List.of(),
                List.of("Transmit station online beacon with exact terminal formatting"),
                "java-basics",
                1L,
                List.of("foundation")
        );

        // Node 3: VARIABLES (Branch from Foundation)
        boolean varMastered = p2 != null && Boolean.TRUE.equals(p2.getCompleted());
        boolean varAvailable = rootMastered || (p2 != null && Boolean.TRUE.equals(p2.getUnlocked()));
        String varState = varMastered ? "MASTERED" : (p2 != null && p2.getAttempts() > 0 ? "IN_PROGRESS" : (varAvailable ? "AVAILABLE" : "LOCKED"));
        int varMastery = varMastered ? 100 : (p2 != null && Boolean.TRUE.equals(p2.getLessonCompleted()) ? 50 : (varAvailable ? 10 : 0));

        var nodeVariables = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "variables",
                "Variables & Memory",
                "State Management",
                varState,
                varMastery,
                "Declaring, allocating, and updating named memory locations.",
                "Learned variable types, declaration syntax, lowerCamelCase naming, and value assignment.",
                varMastered ? List.of("Mission 02: Power Core Stabilization") : List.of(),
                List.of("Stabilize reactor core by declaring and updating fuel telemetry"),
                "variables",
                2L,
                List.of("foundation")
        );

        // Node 4: INPUT (Branch from Variables)
        boolean inputMastered = p3 != null && Boolean.TRUE.equals(p3.getCompleted());
        boolean inputAvailable = varMastered || (p3 != null && Boolean.TRUE.equals(p3.getUnlocked()));
        String inputState = inputMastered ? "MASTERED" : (p3 != null && p3.getAttempts() > 0 ? "IN_PROGRESS" : (inputAvailable ? "AVAILABLE" : "LOCKED"));
        int inputMastery = inputMastered ? 100 : (p3 != null && Boolean.TRUE.equals(p3.getLessonCompleted()) ? 50 : (inputAvailable ? 10 : 0));

        var nodeInput = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "input",
                "Scanner & Input",
                "Telemetry IO",
                inputState,
                inputMastery,
                "Parsing live input tokens and text streams via java.util.Scanner.",
                "Learned Scanner instantiation, System.in binding, nextLine(), nextInt(), and stream closing.",
                inputMastered ? List.of("Mission 03: Communication Array Realignment") : List.of(),
                List.of("Listen to sub-space distress beacons and echo verified coordinates"),
                "input-scanner",
                3L,
                List.of("variables")
        );

        // Node 5: OPERATORS (Branch from Input)
        boolean opMastered = p4 != null && Boolean.TRUE.equals(p4.getCompleted());
        boolean opAvailable = inputMastered || (p4 != null && Boolean.TRUE.equals(p4.getUnlocked()));
        String opState = opMastered ? "MASTERED" : (p4 != null && p4.getAttempts() > 0 ? "IN_PROGRESS" : (opAvailable ? "AVAILABLE" : "LOCKED"));
        int opMastery = opMastered ? 100 : (p4 != null && Boolean.TRUE.equals(p4.getLessonCompleted()) ? 50 : (opAvailable ? 10 : 0));

        var nodeOperators = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "operators",
                "Operators & Math",
                "Calculations",
                opState,
                opMastery,
                "Arithmetic operations (+, -, *, /, %), precedence, and compound mutations.",
                "Learned arithmetic calculations, modulus division, operator order of operations, and += shortcuts.",
                opMastered ? List.of("Mission 04: Thruster Calibration") : List.of(),
                List.of("Calculate precise thruster burn consumptions and remaining flight reserves"),
                "operators",
                4L,
                List.of("input")
        );

        // Node 6: CONDITIONS (Branch from Operators)
        boolean condMastered = p5 != null && Boolean.TRUE.equals(p5.getCompleted());
        boolean condAvailable = opMastered || (p5 != null && Boolean.TRUE.equals(p5.getUnlocked()));
        String condState = condMastered ? "MASTERED" : (p5 != null && p5.getAttempts() > 0 ? "IN_PROGRESS" : (condAvailable ? "AVAILABLE" : "LOCKED"));
        int condMastery = condMastered ? 100 : (p5 != null && Boolean.TRUE.equals(p5.getLessonCompleted()) ? 50 : (condAvailable ? 10 : 0));

        var nodeConditions = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "conditions",
                "Conditions & Logic",
                "Control Flow",
                condState,
                condMastery,
                "Branching execution paths with if, else-if, else, and boolean logic (&&, ||, !).",
                "Learned boolean comparisons, logical operators, short-circuit evaluation, and multi-tier hazard gating.",
                condMastered ? List.of("Mission 05: Emergency Interlock Protocol") : List.of(),
                List.of("Evaluate multiple station pressure and radiation readings to grant launch clearance"),
                "conditions",
                5L,
                List.of("operators")
        );

        // Node 7: LOOPS (Branch from Conditions - World 3)
        String loopState = condMastered ? "AVAILABLE" : "LOCKED";
        var nodeLoops = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "loops",
                "Loops & Iterations",
                "Control Flow",
                loopState,
                0,
                "Repetitive automation with for, while, do-while, and loop control statements.",
                "Loop bounds, iteration indices, loop termination checks, and cyclic telemetry pulses.",
                List.of(),
                List.of("Sector 03: Cyclic Pulse Automation"),
                "loops",
                6L,
                List.of("conditions")
        );

        // Node 8: METHODS (Branch from Loops - World 4)
        var nodeMethods = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "methods",
                "Methods & Functions",
                "Architecture",
                "LOCKED",
                0,
                "Modular subroutines, parameter passing, return types, and code reusability.",
                "DRY architecture, method signatures, return values, and parameters.",
                List.of(),
                List.of("Sector 04: Quantum Sensor Mesh Subroutines"),
                "methods",
                7L,
                List.of("loops")
        );

        // Node 9: ARRAYS (Branch from Methods)
        var nodeArrays = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "arrays",
                "Arrays & Collections",
                "Data Structures",
                "LOCKED",
                0,
                "Fixed-size ordered indexable collections of data elements.",
                "Array allocation, zero-based indexing, traversal with loops, and bounds checking.",
                List.of(),
                List.of("Deep Space Cargo Manifest Matrix"),
                "variables",
                8L,
                List.of("methods")
        );

        // Node 10: OOP (Branch from Arrays)
        var nodeOOP = new com.codevoyage.progress.dto.SkillTreeNodeDTO(
                "oop",
                "Object-Oriented Programming",
                "Ship AI & Models",
                "LOCKED",
                0,
                "Classes, objects, encapsulation, constructors, and instance state.",
                "Constructors, private fields, public accessors, and autonomous ship agents.",
                List.of(),
                List.of("Starship Autonomous Pilot AI Construction"),
                "java-basics",
                9L,
                List.of("arrays")
        );

        return List.of(
                nodeRoot,
                nodeOutput,
                nodeVariables,
                nodeInput,
                nodeOperators,
                nodeConditions,
                nodeLoops,
                nodeMethods,
                nodeArrays,
                nodeOOP
        );
    }

    @Transactional
    public void recordAttempt(Long userId, Long missionId) {
        User user = userRepository.findById(userId).orElse(null);
        Mission mission = missionRepository.findById(missionId).orElse(null);
        if (user == null || mission == null) return;

        UserProgress progress = userProgressRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseGet(() -> new UserProgress(user, mission, true));

        progress.setAttempts(progress.getAttempts() + 1);
        progress.setLastAttemptedAt(LocalDateTime.now());
        userProgressRepository.save(progress);
    }

    @Transactional
    public void recordHintUsed(Long userId, Long missionId) {
        User user = userRepository.findById(userId).orElse(null);
        Mission mission = missionRepository.findById(missionId).orElse(null);
        if (user == null || mission == null) return;

        UserProgress progress = userProgressRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseGet(() -> new UserProgress(user, mission, true));

        progress.setHintsUsed(progress.getHintsUsed() + 1);
        userProgressRepository.save(progress);
    }

    /**
     * Award XP for Lesson completion on server side.
     * Prevents duplicate XP if already completed.
     */
    @Transactional
    public int completeLesson(Long userId, Long missionId) {
        User user = userRepository.findById(userId).orElse(null);
        Mission mission = missionRepository.findById(missionId).orElse(null);
        if (user == null || mission == null) return 0;

        UserProgress progress = userProgressRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseGet(() -> new UserProgress(user, mission, true));

        if (Boolean.TRUE.equals(progress.getLessonCompleted())) {
            return 0; // Prevent duplicate XP
        }

        progress.setLessonCompleted(true);
        int lessonXp = 25; // Standard lesson engagement XP
        progress.setXpEarned(progress.getXpEarned() + lessonXp);
        userProgressRepository.save(progress);

        int newTotalXp = (user.getXp() != null ? user.getXp() : 0) + lessonXp;
        user.setXp(newTotalXp);
        user.setLevel(UserLevelSystem.calculateLevel(newTotalXp));
        userRepository.save(user);

        return lessonXp;
    }

    /**
     * Award XP for Practice completion on server side.
     * Prevents duplicate XP if already completed.
     */
    @Transactional
    public int completePractice(Long userId, Long missionId) {
        User user = userRepository.findById(userId).orElse(null);
        Mission mission = missionRepository.findById(missionId).orElse(null);
        if (user == null || mission == null) return 0;

        UserProgress progress = userProgressRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseGet(() -> new UserProgress(user, mission, true));

        if (Boolean.TRUE.equals(progress.getPracticeCompleted())) {
            return 0; // Prevent duplicate XP
        }

        progress.setPracticeCompleted(true);
        int practiceXp = 50; // Standard practice drill XP
        progress.setXpEarned(progress.getXpEarned() + practiceXp);
        userProgressRepository.save(progress);

        int newTotalXp = (user.getXp() != null ? user.getXp() : 0) + practiceXp;
        user.setXp(newTotalXp);
        user.setLevel(UserLevelSystem.calculateLevel(newTotalXp));
        userRepository.save(user);

        return practiceXp;
    }

    /**
     * Calculate star rating:
     * - 3 stars: Completed without hints (hintsUsed == 0)
     * - 2 stars: Completed with limited assistance (hintsUsed <= 1)
     * - 1 star: Challenge completed
     * Designed to be encouraging and not overly punishing.
     */
    public int calculateStars(int hintsUsed, int attempts) {
        if (hintsUsed == 0) {
            return 3;
        } else if (hintsUsed <= 1) {
            return 2;
        } else {
            return 1;
        }
    }

    @Transactional
    public void completeMission(Long userId, Long missionId, int starsEarned, int xpEarned, long durationSeconds) {
        User user = userRepository.findById(userId).orElse(null);
        Mission mission = missionRepository.findById(missionId).orElse(null);
        if (user == null || mission == null) return;

        UserProgress progress = userProgressRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseGet(() -> new UserProgress(user, mission, true));

        boolean wasAlreadyCompleted = Boolean.TRUE.equals(progress.getCompleted());

        progress.setCompleted(true);
        progress.setUnlocked(true);
        progress.setStars(Math.max(progress.getStars(), starsEarned));
        progress.setXpEarned(Math.max(progress.getXpEarned(), xpEarned));
        progress.setCompletionTimeSeconds(durationSeconds);
        progress.setCompletedAt(LocalDateTime.now());
        userProgressRepository.save(progress);

        if (!wasAlreadyCompleted) {
            int newTotalXp = (user.getXp() != null ? user.getXp() : 0) + xpEarned;
            int newTotalStars = (user.getStars() != null ? user.getStars() : 0) + starsEarned;
            int newLevel = UserLevelSystem.calculateLevel(newTotalXp);

            user.setXp(newTotalXp);
            user.setStars(newTotalStars);
            user.setLevel(newLevel);
            userRepository.save(user);

            // Award mission-specific learning achievements
            if (mission.getMissionOrder() == 1) {
                awardAchievement(user, "CODE_CADET");
                awardAchievement(user, "FIRST_STEPS");
                awardAchievement(user, "FIRST_IGNITION");
                awardAchievement(user, "CONSOLE_HERO");
            }

            if (mission.getMissionOrder() == 2) {
                awardAchievement(user, "VARIABLE_MASTER");
            }

            if (mission.getMissionOrder() == 3) {
                awardAchievement(user, "INPUT_SPECIALIST");
            }

            if (mission.getMissionOrder() == 5) {
                awardAchievement(user, "LOGIC_PILOT");
            }

            // Award BUG_HUNTER if user encountered and resolved syntax / test failures before completing
            if (progress.getAttempts() != null && progress.getAttempts() >= 2) {
                awardAchievement(user, "BUG_HUNTER");
            }

            // Check NO_HINTS: Complete 5 challenges without hints
            long noHintsCount = userProgressRepository.findByUserId(userId).stream()
                    .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                    .filter(up -> up.getHintsUsed() != null && up.getHintsUsed() == 0)
                    .count();
            if (noHintsCount >= 5) {
                awardAchievement(user, "NO_HINTS");
            }
        }

        // Unlock next mission in current world in sequence (both on first clear and replay)
        missionRepository.findByWorldIdOrderByMissionOrderAsc(mission.getWorld().getId())
                .stream()
                .filter(m -> m.getMissionOrder() == mission.getMissionOrder() + 1)
                .findFirst()
                .ifPresent(nextMission -> {
                    UserProgress nextProgress = userProgressRepository.findByUserIdAndMissionId(userId, nextMission.getId())
                            .orElseGet(() -> new UserProgress(user, nextMission, true));
                    nextProgress.setUnlocked(true);
                    userProgressRepository.save(nextProgress);
                });

        // Check if all missions in current world are complete
        World currentWorld = mission.getWorld();
        List<Mission> currentWorldMissions = missionRepository.findByWorldIdOrderByMissionOrderAsc(currentWorld.getId());
        List<UserProgress> userWorldProgress = userProgressRepository.findByUserId(userId).stream()
                .filter(up -> up.getMission() != null && up.getMission().getWorld() != null && up.getMission().getWorld().getId().equals(currentWorld.getId()))
                .filter(up -> Boolean.TRUE.equals(up.getCompleted()))
                .toList();

        if (!currentWorldMissions.isEmpty() && userWorldProgress.size() >= currentWorldMissions.size()) {
            if (!wasAlreadyCompleted && currentWorld.getWorldOrder() == 1) {
                awardAchievement(user, "FIRST_LAUNCH");
                awardAchievement(user, "WORLD_CONQUEROR");
                awardAchievement(user, "IGNIS_STATION_HERO");
            }

            // Unlock next world for this user by advancing currentSector
            int nextSector = currentWorld.getWorldOrder() + 1;
            int updatedSector = Math.max(user.getCurrentSector() != null ? user.getCurrentSector() : 1, nextSector);
            if (user.getCurrentSector() == null || user.getCurrentSector() < updatedSector) {
                user.setCurrentSector(updatedSector);
                userRepository.save(user);
            }

            // Unlock World (nextSector) Mission 1 for this user
            worldRepository.findAll().stream()
                    .filter(w -> w.getWorldOrder() == nextSector)
                    .findFirst()
                    .ifPresent(nextWorld -> {
                        missionRepository.findByWorldIdOrderByMissionOrderAsc(nextWorld.getId())
                                .stream()
                                .findFirst()
                                .ifPresent(nextWorldM1 -> {
                                    UserProgress nextM1Progress = userProgressRepository.findByUserIdAndMissionId(userId, nextWorldM1.getId())
                                            .orElseGet(() -> new UserProgress(user, nextWorldM1, true));
                                    nextM1Progress.setUnlocked(true);
                                    userProgressRepository.save(nextM1Progress);
                                });
                    });
        }
    }

    private void awardAchievement(User user, String achievementCode) {
        achievementRepository.findByCode(achievementCode).ifPresent(achievement -> {
            if (!userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), achievement.getId())) {
                UserAchievement ua = new UserAchievement(user, achievement);
                userAchievementRepository.save(ua);
            }
        });
    }
}
