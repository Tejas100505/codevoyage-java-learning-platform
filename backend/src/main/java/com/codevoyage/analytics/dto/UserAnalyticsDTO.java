package com.codevoyage.analytics.dto;

import java.util.List;

public class UserAnalyticsDTO {
    // User core metrics
    private Long userId;
    private String username;
    private String rankTitle;
    private int currentXp;

    private int lessonsCompleted;
    private int practiceQuestionsAttempted;
    private int practiceAccuracyPercentage;
    private int codingChallengesCompleted;
    private int codingAttempts;
    private double testSuccessRate;               // e.g. 84.5% (all test cases passed)
    private double compilationSuccessRate;        // e.g. 92.0% (programs that compiled cleanly)
    private int hintsUsed;
    private long totalTimeSpentSeconds;
    private String formattedTimeSpent;            // e.g. "1h 45m" or "38m"
    private int worldProgressPercentage;
    private int completedMissionsCount;
    private int totalMissionsCount;
    private int activeConceptMasteryPercentage;   // Average mastery across attempted concepts only
    private boolean hasSufficientData;

    // Granular concepts
    private List<ConceptMasteryDTO> conceptMasteries;

    // Summary concept buckets
    private List<String> strongConcepts;
    private List<String> conceptsNeedingPractice;

    // Common errors aggregated across all submissions
    private List<String> commonErrors;

    // Challenge performance metrics
    private int firstAttemptPasses;
    private int syntaxErrorsEncountered;
    private int runtimeErrorsEncountered;
    private int logicFailuresEncountered;
    private double averageAttemptsPerChallenge;

    public UserAnalyticsDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }

    public int getCurrentXp() { return currentXp; }
    public void setCurrentXp(int currentXp) { this.currentXp = currentXp; }

    public int getLessonsCompleted() { return lessonsCompleted; }
    public void setLessonsCompleted(int lessonsCompleted) { this.lessonsCompleted = lessonsCompleted; }

    public int getPracticeQuestionsAttempted() { return practiceQuestionsAttempted; }
    public void setPracticeQuestionsAttempted(int practiceQuestionsAttempted) { this.practiceQuestionsAttempted = practiceQuestionsAttempted; }

    public int getPracticeAccuracyPercentage() { return practiceAccuracyPercentage; }
    public void setPracticeAccuracyPercentage(int practiceAccuracyPercentage) { this.practiceAccuracyPercentage = practiceAccuracyPercentage; }

    public int getCodingChallengesCompleted() { return codingChallengesCompleted; }
    public void setCodingChallengesCompleted(int codingChallengesCompleted) { this.codingChallengesCompleted = codingChallengesCompleted; }

    public int getCodingAttempts() { return codingAttempts; }
    public void setCodingAttempts(int codingAttempts) { this.codingAttempts = codingAttempts; }

    public double getTestSuccessRate() { return testSuccessRate; }
    public void setTestSuccessRate(double testSuccessRate) { this.testSuccessRate = testSuccessRate; }

    public double getCompilationSuccessRate() { return compilationSuccessRate; }
    public void setCompilationSuccessRate(double compilationSuccessRate) { this.compilationSuccessRate = compilationSuccessRate; }

    public int getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(int hintsUsed) { this.hintsUsed = hintsUsed; }

    public long getTotalTimeSpentSeconds() { return totalTimeSpentSeconds; }
    public void setTotalTimeSpentSeconds(long totalTimeSpentSeconds) { this.totalTimeSpentSeconds = totalTimeSpentSeconds; }

    public String getFormattedTimeSpent() { return formattedTimeSpent; }
    public void setFormattedTimeSpent(String formattedTimeSpent) { this.formattedTimeSpent = formattedTimeSpent; }

    public int getWorldProgressPercentage() { return worldProgressPercentage; }
    public void setWorldProgressPercentage(int worldProgressPercentage) { this.worldProgressPercentage = worldProgressPercentage; }

    public int getCompletedMissionsCount() { return completedMissionsCount; }
    public void setCompletedMissionsCount(int completedMissionsCount) { this.completedMissionsCount = completedMissionsCount; }

    public int getTotalMissionsCount() { return totalMissionsCount; }
    public void setTotalMissionsCount(int totalMissionsCount) { this.totalMissionsCount = totalMissionsCount; }

    public int getActiveConceptMasteryPercentage() { return activeConceptMasteryPercentage; }
    public void setActiveConceptMasteryPercentage(int activeConceptMasteryPercentage) { this.activeConceptMasteryPercentage = activeConceptMasteryPercentage; }

    public boolean isHasSufficientData() { return hasSufficientData; }
    public void setHasSufficientData(boolean hasSufficientData) { this.hasSufficientData = hasSufficientData; }

    public List<ConceptMasteryDTO> getConceptMasteries() { return conceptMasteries; }
    public void setConceptMasteries(List<ConceptMasteryDTO> conceptMasteries) { this.conceptMasteries = conceptMasteries; }

    public List<String> getStrongConcepts() { return strongConcepts; }
    public void setStrongConcepts(List<String> strongConcepts) { this.strongConcepts = strongConcepts; }

    public List<String> getConceptsNeedingPractice() { return conceptsNeedingPractice; }
    public void setConceptsNeedingPractice(List<String> conceptsNeedingPractice) { this.conceptsNeedingPractice = conceptsNeedingPractice; }

    public List<String> getCommonErrors() { return commonErrors; }
    public void setCommonErrors(List<String> commonErrors) { this.commonErrors = commonErrors; }

    public int getFirstAttemptPasses() { return firstAttemptPasses; }
    public void setFirstAttemptPasses(int firstAttemptPasses) { this.firstAttemptPasses = firstAttemptPasses; }

    public int getSyntaxErrorsEncountered() { return syntaxErrorsEncountered; }
    public void setSyntaxErrorsEncountered(int syntaxErrorsEncountered) { this.syntaxErrorsEncountered = syntaxErrorsEncountered; }

    public int getRuntimeErrorsEncountered() { return runtimeErrorsEncountered; }
    public void setRuntimeErrorsEncountered(int runtimeErrorsEncountered) { this.runtimeErrorsEncountered = runtimeErrorsEncountered; }

    public int getLogicFailuresEncountered() { return logicFailuresEncountered; }
    public void setLogicFailuresEncountered(int logicFailuresEncountered) { this.logicFailuresEncountered = logicFailuresEncountered; }

    public double getAverageAttemptsPerChallenge() { return averageAttemptsPerChallenge; }
    public void setAverageAttemptsPerChallenge(double averageAttemptsPerChallenge) { this.averageAttemptsPerChallenge = averageAttemptsPerChallenge; }
}
