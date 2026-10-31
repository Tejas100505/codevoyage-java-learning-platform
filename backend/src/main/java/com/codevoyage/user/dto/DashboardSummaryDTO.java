package com.codevoyage.user.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    private UserProfileDTO user;
    private String rankTitle;
    private int currentXp;
    private int nextLevelXp;
    private double xpPercentage;
    
    // Current Mission & World
    private Long currentMissionId;
    private String currentMissionTitle;
    private String currentMissionWorldName;
    private String currentMissionObjective;
    private String currentMissionConcept;
    private String currentMissionDifficulty;

    // Progress metrics
    private int totalJavaMissions;
    private int completedMissionsCount;
    private double javaProgressPercent;
    private int totalWorlds;
    private int unlockedWorldsCount;
    private double worldProgressPercent;
    private int totalStarsEarned;
    private int maxAvailableStars;

    // Achievements
    private int unlockedAchievementsCount;
    private int totalAchievementsCount;
    private List<Map<String, Object>> recentAchievements;

    // Recent activity & missions
    private List<Map<String, Object>> recentMissions;

    // Granular concept progress (Java Basics, Variables, Data Types, Input / Output, Operators, Conditions, Loops, Methods)
    private List<Map<String, Object>> conceptProgress;

    public DashboardSummaryDTO() {}

    public UserProfileDTO getUser() { return user; }
    public void setUser(UserProfileDTO user) { this.user = user; }

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }

    public int getCurrentXp() { return currentXp; }
    public void setCurrentXp(int currentXp) { this.currentXp = currentXp; }

    public int getNextLevelXp() { return nextLevelXp; }
    public void setNextLevelXp(int nextLevelXp) { this.nextLevelXp = nextLevelXp; }

    public double getXpPercentage() { return xpPercentage; }
    public void setXpPercentage(double xpPercentage) { this.xpPercentage = xpPercentage; }

    public Long getCurrentMissionId() { return currentMissionId; }
    public void setCurrentMissionId(Long currentMissionId) { this.currentMissionId = currentMissionId; }

    public String getCurrentMissionTitle() { return currentMissionTitle; }
    public void setCurrentMissionTitle(String currentMissionTitle) { this.currentMissionTitle = currentMissionTitle; }

    public String getCurrentMissionWorldName() { return currentMissionWorldName; }
    public void setCurrentMissionWorldName(String currentMissionWorldName) { this.currentMissionWorldName = currentMissionWorldName; }

    public String getCurrentMissionObjective() { return currentMissionObjective; }
    public void setCurrentMissionObjective(String currentMissionObjective) { this.currentMissionObjective = currentMissionObjective; }

    public String getCurrentMissionConcept() { return currentMissionConcept; }
    public void setCurrentMissionConcept(String currentMissionConcept) { this.currentMissionConcept = currentMissionConcept; }

    public String getCurrentMissionDifficulty() { return currentMissionDifficulty; }
    public void setCurrentMissionDifficulty(String currentMissionDifficulty) { this.currentMissionDifficulty = currentMissionDifficulty; }

    public int getTotalJavaMissions() { return totalJavaMissions; }
    public void setTotalJavaMissions(int totalJavaMissions) { this.totalJavaMissions = totalJavaMissions; }

    public int getCompletedMissionsCount() { return completedMissionsCount; }
    public void setCompletedMissionsCount(int completedMissionsCount) { this.completedMissionsCount = completedMissionsCount; }

    public double getJavaProgressPercent() { return javaProgressPercent; }
    public void setJavaProgressPercent(double javaProgressPercent) { this.javaProgressPercent = javaProgressPercent; }

    public int getTotalWorlds() { return totalWorlds; }
    public void setTotalWorlds(int totalWorlds) { this.totalWorlds = totalWorlds; }

    public int getUnlockedWorldsCount() { return unlockedWorldsCount; }
    public void setUnlockedWorldsCount(int unlockedWorldsCount) { this.unlockedWorldsCount = unlockedWorldsCount; }

    public double getWorldProgressPercent() { return worldProgressPercent; }
    public void setWorldProgressPercent(double worldProgressPercent) { this.worldProgressPercent = worldProgressPercent; }

    public int getTotalStarsEarned() { return totalStarsEarned; }
    public void setTotalStarsEarned(int totalStarsEarned) { this.totalStarsEarned = totalStarsEarned; }

    public int getMaxAvailableStars() { return maxAvailableStars; }
    public void setMaxAvailableStars(int maxAvailableStars) { this.maxAvailableStars = maxAvailableStars; }

    public int getUnlockedAchievementsCount() { return unlockedAchievementsCount; }
    public void setUnlockedAchievementsCount(int unlockedAchievementsCount) { this.unlockedAchievementsCount = unlockedAchievementsCount; }

    public int getTotalAchievementsCount() { return totalAchievementsCount; }
    public void setTotalAchievementsCount(int totalAchievementsCount) { this.totalAchievementsCount = totalAchievementsCount; }

    public List<Map<String, Object>> getRecentAchievements() { return recentAchievements; }
    public void setRecentAchievements(List<Map<String, Object>> recentAchievements) { this.recentAchievements = recentAchievements; }

    public List<Map<String, Object>> getRecentMissions() { return recentMissions; }
    public void setRecentMissions(List<Map<String, Object>> recentMissions) { this.recentMissions = recentMissions; }

    public List<Map<String, Object>> getConceptProgress() { return conceptProgress; }
    public void setConceptProgress(List<Map<String, Object>> conceptProgress) { this.conceptProgress = conceptProgress; }
}
