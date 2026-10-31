package com.codevoyage.analytics.dto;

import java.util.List;

public class FacultyAnalyticsDTO {
    private int totalEnrolledCadets;
    private int activeLearnersCount;
    private double classAverageMastery;
    private double classAverageTestSuccessRate;
    private int totalMissionsClearedClasswide;
    private List<ClassConceptMasteryItem> conceptDistributions;
    private List<ChallengingMissionItem> challengingMissions;
    private List<CadetRosterItem> cadetRoster;

    public FacultyAnalyticsDTO() {}

    public static class ClassConceptMasteryItem {
        private String conceptName;
        private double averageMastery;
        private int totalAttempts;
        private double failureRate;

        public ClassConceptMasteryItem() {}
        public ClassConceptMasteryItem(String conceptName, double averageMastery, int totalAttempts, double failureRate) {
            this.conceptName = conceptName;
            this.averageMastery = averageMastery;
            this.totalAttempts = totalAttempts;
            this.failureRate = failureRate;
        }

        public String getConceptName() { return conceptName; }
        public void setConceptName(String conceptName) { this.conceptName = conceptName; }
        public double getAverageMastery() { return averageMastery; }
        public void setAverageMastery(double averageMastery) { this.averageMastery = averageMastery; }
        public int getTotalAttempts() { return totalAttempts; }
        public void setTotalAttempts(int totalAttempts) { this.totalAttempts = totalAttempts; }
        public double getFailureRate() { return failureRate; }
        public void setFailureRate(double failureRate) { this.failureRate = failureRate; }
    }

    public static class ChallengingMissionItem {
        private Long missionId;
        private String missionTitle;
        private String javaConcept;
        private double averageAttempts;
        private double completionRate;

        public ChallengingMissionItem() {}
        public ChallengingMissionItem(Long missionId, String missionTitle, String javaConcept, double averageAttempts, double completionRate) {
            this.missionId = missionId;
            this.missionTitle = missionTitle;
            this.javaConcept = javaConcept;
            this.averageAttempts = averageAttempts;
            this.completionRate = completionRate;
        }

        public Long getMissionId() { return missionId; }
        public void setMissionId(Long missionId) { this.missionId = missionId; }
        public String getMissionTitle() { return missionTitle; }
        public void setMissionTitle(String missionTitle) { this.missionTitle = missionTitle; }
        public String getJavaConcept() { return javaConcept; }
        public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }
        public double getAverageAttempts() { return averageAttempts; }
        public void setAverageAttempts(double averageAttempts) { this.averageAttempts = averageAttempts; }
        public double getCompletionRate() { return completionRate; }
        public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
    }

    public static class CadetRosterItem {
        private Long userId;
        private String callsign;
        private int level;
        private int xp;
        private int missionsCompleted;
        private double testSuccessRate;
        private String rankTitle;

        public CadetRosterItem() {}
        public CadetRosterItem(Long userId, String callsign, int level, int xp, int missionsCompleted, double testSuccessRate, String rankTitle) {
            this.userId = userId;
            this.callsign = callsign;
            this.level = level;
            this.xp = xp;
            this.missionsCompleted = missionsCompleted;
            this.testSuccessRate = testSuccessRate;
            this.rankTitle = rankTitle;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getCallsign() { return callsign; }
        public void setCallsign(String callsign) { this.callsign = callsign; }
        public int getLevel() { return level; }
        public void setLevel(int level) { this.level = level; }
        public int getXp() { return xp; }
        public void setXp(int xp) { this.xp = xp; }
        public int getMissionsCompleted() { return missionsCompleted; }
        public void setMissionsCompleted(int missionsCompleted) { this.missionsCompleted = missionsCompleted; }
        public double getTestSuccessRate() { return testSuccessRate; }
        public void setTestSuccessRate(double testSuccessRate) { this.testSuccessRate = testSuccessRate; }
        public String getRankTitle() { return rankTitle; }
        public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
    }

    public int getTotalEnrolledCadets() { return totalEnrolledCadets; }
    public void setTotalEnrolledCadets(int totalEnrolledCadets) { this.totalEnrolledCadets = totalEnrolledCadets; }

    public int getActiveLearnersCount() { return activeLearnersCount; }
    public void setActiveLearnersCount(int activeLearnersCount) { this.activeLearnersCount = activeLearnersCount; }

    public double getClassAverageMastery() { return classAverageMastery; }
    public void setClassAverageMastery(double classAverageMastery) { this.classAverageMastery = classAverageMastery; }

    public double getClassAverageTestSuccessRate() { return classAverageTestSuccessRate; }
    public void setClassAverageTestSuccessRate(double classAverageTestSuccessRate) { this.classAverageTestSuccessRate = classAverageTestSuccessRate; }

    public int getTotalMissionsClearedClasswide() { return totalMissionsClearedClasswide; }
    public void setTotalMissionsClearedClasswide(int totalMissionsClearedClasswide) { this.totalMissionsClearedClasswide = totalMissionsClearedClasswide; }

    public List<ClassConceptMasteryItem> getConceptDistributions() { return conceptDistributions; }
    public void setConceptDistributions(List<ClassConceptMasteryItem> conceptDistributions) { this.conceptDistributions = conceptDistributions; }

    public List<ChallengingMissionItem> getChallengingMissions() { return challengingMissions; }
    public void setChallengingMissions(List<ChallengingMissionItem> challengingMissions) { this.challengingMissions = challengingMissions; }

    public List<CadetRosterItem> getCadetRoster() { return cadetRoster; }
    public void setCadetRoster(List<CadetRosterItem> cadetRoster) { this.cadetRoster = cadetRoster; }
}

