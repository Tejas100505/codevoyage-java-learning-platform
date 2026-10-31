package com.codevoyage.user;

import com.codevoyage.achievement.AchievementRepository;
import com.codevoyage.achievement.UserAchievementRepository;
import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.user.dto.DashboardSummaryDTO;
import com.codevoyage.user.dto.LanguageUpdateRequest;
import com.codevoyage.user.dto.UserProfileDTO;
import com.codevoyage.world.WorldRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final UserProgressRepository userProgressRepository;
    private final WorldRepository worldRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public UserController(
            UserRepository userRepository,
            MissionRepository missionRepository,
            UserProgressRepository userProgressRepository,
            WorldRepository worldRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository
    ) {
        this.userRepository = userRepository;
        this.missionRepository = missionRepository;
        this.userProgressRepository = userProgressRepository;
        this.worldRepository = worldRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @GetMapping({"/api/users/me", "/api/v1/users/me"})
    public ResponseEntity<UserProfileDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        return ResponseEntity.ok(mapToProfileDTO(user));
    }

    @GetMapping({"/api/users/dashboard", "/api/v1/users/dashboard"})
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setUser(mapToProfileDTO(user));

        // Rank Title based on user level & XP
        int calculatedLevel = UserLevelSystem.calculateLevel(user.getXp() != null ? user.getXp() : 0);
        String rank = UserLevelSystem.getRankTitle(calculatedLevel);
        summary.setRankTitle(rank);

        // XP & Level calculations
        int currentXp = user.getXp() != null ? user.getXp() : 0;
        int nextLevelXp = UserLevelSystem.getNextLevelXpThreshold(calculatedLevel);
        int baseLevelXp = UserLevelSystem.getCurrentLevelBaseXp(calculatedLevel);
        double range = Math.max(1, nextLevelXp - baseLevelXp);
        double xpPercent = Math.min(100.0, Math.max(0.0, ((currentXp - baseLevelXp) / range) * 100.0));
        summary.setCurrentXp(currentXp);
        summary.setNextLevelXp(nextLevelXp);
        summary.setXpPercentage(xpPercent);

        // Missions & Progress
        List<com.codevoyage.mission.Mission> allMissions = missionRepository.findAll();
        List<com.codevoyage.progress.UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        Map<Long, com.codevoyage.progress.UserProgress> progressByMission = userProgressList.stream()
                .collect(java.util.stream.Collectors.toMap(up -> up.getMission().getId(), up -> up, (a, b) -> a));

        int totalMissions = allMissions.size();
        long completedCount = userProgressList.stream().filter(up -> Boolean.TRUE.equals(up.getCompleted())).count();
        summary.setTotalJavaMissions(totalMissions);
        summary.setCompletedMissionsCount((int) completedCount);
        summary.setJavaProgressPercent(totalMissions > 0 ? (completedCount * 100.0 / totalMissions) : 0.0);

        // Worlds progress & sector self-healing
        List<com.codevoyage.world.World> worlds = worldRepository.findAll();
        List<com.codevoyage.mission.Mission> world1Missions = allMissions.stream()
                .filter(m -> m.getWorld() != null && m.getWorld().getWorldOrder() == 1)
                .toList();
        long world1Completed = world1Missions.stream()
                .filter(m -> {
                    com.codevoyage.progress.UserProgress up = progressByMission.get(m.getId());
                    return up != null && Boolean.TRUE.equals(up.getCompleted());
                })
                .count();

        if (!world1Missions.isEmpty() && world1Completed >= world1Missions.size()) {
            if (user.getCurrentSector() == null || user.getCurrentSector() < 2) {
                user.setCurrentSector(2);
                userRepository.save(user);
            }
        }

        summary.setTotalWorlds(worlds.size());
        summary.setUnlockedWorldsCount(Math.min(worlds.size(), user.getCurrentSector() != null ? user.getCurrentSector() : 1));
        summary.setWorldProgressPercent(worlds.size() > 0 ? (summary.getUnlockedWorldsCount() * 100.0 / worlds.size()) : 100.0);

        // Stars
        summary.setTotalStarsEarned(user.getStars() != null ? user.getStars() : 0);
        summary.setMaxAvailableStars(totalMissions * 3);

        // Identify Current Mission (first unlocked & uncompleted, or first mission if none completed, or last mission if all completed)
        int userSector = user.getCurrentSector() != null ? user.getCurrentSector() : 1;
        com.codevoyage.mission.Mission activeMission = allMissions.stream()
                .sorted(java.util.Comparator.comparing((com.codevoyage.mission.Mission m) -> m.getWorld() != null ? m.getWorld().getWorldOrder() : 1)
                        .thenComparingInt(com.codevoyage.mission.Mission::getMissionOrder))
                .filter(m -> {
                    int worldOrder = m.getWorld() != null ? m.getWorld().getWorldOrder() : 1;
                    if (worldOrder > userSector) return false;
                    com.codevoyage.progress.UserProgress up = progressByMission.get(m.getId());
                    boolean completed = up != null && Boolean.TRUE.equals(up.getCompleted());
                    return !completed;
                })
                .findFirst()
                .orElse(allMissions.isEmpty() ? null : allMissions.get(allMissions.size() - 1));

        if (activeMission != null) {
            summary.setCurrentMissionId(activeMission.getId());
            summary.setCurrentMissionTitle(activeMission.getTitle());
            summary.setCurrentMissionWorldName(activeMission.getWorld() != null ? activeMission.getWorld().getName() : "Ignis Station");
            summary.setCurrentMissionObjective(activeMission.getObjective());
            summary.setCurrentMissionConcept(activeMission.getJavaConcept());
            summary.setCurrentMissionDifficulty(activeMission.getDifficulty());
        }

        // Recent Missions List (with status and actual activity ordering)
        List<java.util.Map<String, Object>> recentMissions = allMissions.stream()
                .sorted((m1, m2) -> {
                    com.codevoyage.progress.UserProgress up1 = progressByMission.get(m1.getId());
                    com.codevoyage.progress.UserProgress up2 = progressByMission.get(m2.getId());
                    java.time.LocalDateTime t1 = up1 != null ? (up1.getCompletedAt() != null ? up1.getCompletedAt() : up1.getLastAttemptedAt()) : null;
                    java.time.LocalDateTime t2 = up2 != null ? (up2.getCompletedAt() != null ? up2.getCompletedAt() : up2.getLastAttemptedAt()) : null;
                    if (t1 != null && t2 != null) {
                        return t2.compareTo(t1); // Most recent first
                    } else if (t1 != null) {
                        return -1;
                    } else if (t2 != null) {
                        return 1;
                    }
                    return Integer.compare(m1.getMissionOrder(), m2.getMissionOrder());
                })
                .limit(5)
                .map(m -> {
                    com.codevoyage.progress.UserProgress up = progressByMission.get(m.getId());
                    boolean unlocked = (m.getMissionOrder() == 1) || (up != null && Boolean.TRUE.equals(up.getUnlocked()));
                    boolean completed = up != null && Boolean.TRUE.equals(up.getCompleted());
                    int stars = up != null && up.getStars() != null ? up.getStars() : 0;
                    return java.util.Map.<String, Object>of(
                            "id", m.getId(),
                            "missionOrder", m.getMissionOrder(),
                            "title", m.getTitle(),
                            "concept", m.getJavaConcept(),
                            "unlocked", unlocked,
                            "completed", completed,
                            "stars", stars,
                            "xpReward", m.getXpReward(),
                            "difficulty", m.getDifficulty()
                    );
                })
                .collect(java.util.stream.Collectors.toList());
        summary.setRecentMissions(recentMissions);

        // Granular Java Concept Progress based STRICTLY on actual user activity (do not fabricate)
        // Concepts: Java Basics (M1), Variables (M2), Data Types (M2), Input / Output (M3), Operators (M4), Conditions (M5), Loops, Methods
        boolean m1Done = progressByMission.containsKey(1L) && Boolean.TRUE.equals(progressByMission.get(1L).getCompleted());
        boolean m2Done = progressByMission.containsKey(2L) && Boolean.TRUE.equals(progressByMission.get(2L).getCompleted());
        boolean m3Done = progressByMission.containsKey(3L) && Boolean.TRUE.equals(progressByMission.get(3L).getCompleted());
        boolean m4Done = progressByMission.containsKey(4L) && Boolean.TRUE.equals(progressByMission.get(4L).getCompleted());
        boolean m5Done = progressByMission.containsKey(5L) && Boolean.TRUE.equals(progressByMission.get(5L).getCompleted());

        List<java.util.Map<String, Object>> concepts = List.of(
                java.util.Map.of("name", "Java Basics", "completed", m1Done, "percent", m1Done ? 100 : 0, "tag", "Syntax & Structure"),
                java.util.Map.of("name", "Variables", "completed", m2Done, "percent", m2Done ? 100 : 0, "tag", "Memory Allocation"),
                java.util.Map.of("name", "Data Types", "completed", m2Done, "percent", m2Done ? 100 : 0, "tag", "Primitive Types"),
                java.util.Map.of("name", "Input / Output", "completed", m3Done, "percent", m3Done ? 100 : 0, "tag", "Scanner & Telemetry"),
                java.util.Map.of("name", "Operators", "completed", m4Done, "percent", m4Done ? 100 : 0, "tag", "Arithmetic & Calculations"),
                java.util.Map.of("name", "Conditions", "completed", m5Done, "percent", m5Done ? 100 : 0, "tag", "Branching & Logic"),
                java.util.Map.of("name", "Loops", "completed", false, "percent", 0, "tag", "Iterations (World 3)"),
                java.util.Map.of("name", "Methods", "completed", false, "percent", 0, "tag", "Functions (World 4)")
        );
        summary.setConceptProgress(concepts);

        // Achievements
        List<com.codevoyage.achievement.Achievement> allAchievements = achievementRepository.findAll();
        List<com.codevoyage.achievement.UserAchievement> userAchievements = userAchievementRepository.findByUserId(user.getId());
        summary.setTotalAchievementsCount(allAchievements.size());
        summary.setUnlockedAchievementsCount(userAchievements.size());

        java.util.Set<Long> unlockedIds = userAchievements.stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(java.util.stream.Collectors.toSet());

        List<java.util.Map<String, Object>> recentAchMaps = allAchievements.stream()
                .map(a -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", a.getId());
                    map.put("code", a.getCode());
                    map.put("name", a.getTitle());
                    map.put("description", a.getDescription());
                    map.put("xpReward", a.getXpBonus());
                    map.put("icon", a.getIconName());
                    map.put("unlocked", unlockedIds.contains(a.getId()));
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
        summary.setRecentAchievements(recentAchMaps);

        return ResponseEntity.ok(summary);
    }

    @PutMapping({"/api/users/language", "/api/v1/users/language"})
    public ResponseEntity<UserProfileDTO> updateSelectedLanguage(
            @RequestBody LanguageUpdateRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        if (request != null && request.getLanguage() != null && !request.getLanguage().isBlank()) {
            user.setSelectedLanguage(request.getLanguage().toUpperCase().trim());
            user = userRepository.save(user);
        }

        return ResponseEntity.ok(mapToProfileDTO(user));
    }

    private UserProfileDTO mapToProfileDTO(User user) {
        int actualXp = user.getXp() != null ? user.getXp() : 0;
        int calculatedLevel = UserLevelSystem.calculateLevel(actualXp);
        String rankTitle = UserLevelSystem.getRankTitle(calculatedLevel);

        UserProfileDTO dto = new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatar(),
                user.getRole(),
                actualXp,
                calculatedLevel,
                user.getCoins(),
                user.getStreak(),
                user.getSelectedLanguage(),
                user.getStars(),
                user.getCurrentSector(),
                user.getCreatedAt()
        );
        dto.setRankTitle(rankTitle);
        return dto;
    }
}
