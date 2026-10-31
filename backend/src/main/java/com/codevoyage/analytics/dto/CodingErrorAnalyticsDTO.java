package com.codevoyage.analytics.dto;

import java.util.List;

public class CodingErrorAnalyticsDTO {
    private int totalSubmissions;
    private int compilationFailures;
    private int runtimeErrors;
    private int incorrectOutputs;
    private int successfulSubmissions;

    private double compilationSuccessRate;
    private double testPassRate;
    private int firstAttemptSuccessCount;
    private double firstAttemptSuccessRate;

    private List<ErrorCategoryItem> errorCategories;
    private List<ConceptFailureRateItem> conceptFailureRates;
    private List<ChallengeFailureRateItem> challengeFailureRates;
    private List<String> diagnosticAdvice;

    public CodingErrorAnalyticsDTO() {}

    public static class ErrorCategoryItem {
        private String category;
        private int count;
        private double percentage;

        public ErrorCategoryItem() {}
        public ErrorCategoryItem(String category, int count, double percentage) {
            this.category = category;
            this.count = count;
            this.percentage = percentage;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class ConceptFailureRateItem {
        private String conceptKey;
        private String conceptName;
        private int attempts;
        private int failures;
        private double failureRate;
        private String dominantFailureType;

        public ConceptFailureRateItem() {}
        public ConceptFailureRateItem(String conceptKey, String conceptName, int attempts, int failures, double failureRate, String dominantFailureType) {
            this.conceptKey = conceptKey;
            this.conceptName = conceptName;
            this.attempts = attempts;
            this.failures = failures;
            this.failureRate = failureRate;
            this.dominantFailureType = dominantFailureType;
        }

        public String getConceptKey() { return conceptKey; }
        public void setConceptKey(String conceptKey) { this.conceptKey = conceptKey; }
        public String getConceptName() { return conceptName; }
        public void setConceptName(String conceptName) { this.conceptName = conceptName; }
        public int getAttempts() { return attempts; }
        public void setAttempts(int attempts) { this.attempts = attempts; }
        public int getFailures() { return failures; }
        public void setFailures(int failures) { this.failures = failures; }
        public double getFailureRate() { return failureRate; }
        public void setFailureRate(double failureRate) { this.failureRate = failureRate; }
        public String getDominantFailureType() { return dominantFailureType; }
        public void setDominantFailureType(String dominantFailureType) { this.dominantFailureType = dominantFailureType; }
    }

    public static class ChallengeFailureRateItem {
        private Long missionId;
        private String missionTitle;
        private String javaConcept;
        private int attempts;
        private int failureCount;
        private double successRate;

        public ChallengeFailureRateItem() {}
        public ChallengeFailureRateItem(Long missionId, String missionTitle, String javaConcept, int attempts, int failureCount, double successRate) {
            this.missionId = missionId;
            this.missionTitle = missionTitle;
            this.javaConcept = javaConcept;
            this.attempts = attempts;
            this.failureCount = failureCount;
            this.successRate = successRate;
        }

        public Long getMissionId() { return missionId; }
        public void setMissionId(Long missionId) { this.missionId = missionId; }
        public String getMissionTitle() { return missionTitle; }
        public void setMissionTitle(String missionTitle) { this.missionTitle = missionTitle; }
        public String getJavaConcept() { return javaConcept; }
        public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }
        public int getAttempts() { return attempts; }
        public void setAttempts(int attempts) { this.attempts = attempts; }
        public int getFailureCount() { return failureCount; }
        public void setFailureCount(int failureCount) { this.failureCount = failureCount; }
        public double getSuccessRate() { return successRate; }
        public void setSuccessRate(double successRate) { this.successRate = successRate; }
    }

    public int getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(int totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public int getCompilationFailures() { return compilationFailures; }
    public void setCompilationFailures(int compilationFailures) { this.compilationFailures = compilationFailures; }

    public int getRuntimeErrors() { return runtimeErrors; }
    public void setRuntimeErrors(int runtimeErrors) { this.runtimeErrors = runtimeErrors; }

    public int getIncorrectOutputs() { return incorrectOutputs; }
    public void setIncorrectOutputs(int incorrectOutputs) { this.incorrectOutputs = incorrectOutputs; }

    public int getSuccessfulSubmissions() { return successfulSubmissions; }
    public void setSuccessfulSubmissions(int successfulSubmissions) { this.successfulSubmissions = successfulSubmissions; }

    public double getCompilationSuccessRate() { return compilationSuccessRate; }
    public void setCompilationSuccessRate(double compilationSuccessRate) { this.compilationSuccessRate = compilationSuccessRate; }

    public double getTestPassRate() { return testPassRate; }
    public void setTestPassRate(double testPassRate) { this.testPassRate = testPassRate; }

    public int getFirstAttemptSuccessCount() { return firstAttemptSuccessCount; }
    public void setFirstAttemptSuccessCount(int firstAttemptSuccessCount) { this.firstAttemptSuccessCount = firstAttemptSuccessCount; }

    public double getFirstAttemptSuccessRate() { return firstAttemptSuccessRate; }
    public void setFirstAttemptSuccessRate(double firstAttemptSuccessRate) { this.firstAttemptSuccessRate = firstAttemptSuccessRate; }

    public List<ErrorCategoryItem> getErrorCategories() { return errorCategories; }
    public void setErrorCategories(List<ErrorCategoryItem> errorCategories) { this.errorCategories = errorCategories; }

    public List<ConceptFailureRateItem> getConceptFailureRates() { return conceptFailureRates; }
    public void setConceptFailureRates(List<ConceptFailureRateItem> conceptFailureRates) { this.conceptFailureRates = conceptFailureRates; }

    public List<ChallengeFailureRateItem> getChallengeFailureRates() { return challengeFailureRates; }
    public void setChallengeFailureRates(List<ChallengeFailureRateItem> challengeFailureRates) { this.challengeFailureRates = challengeFailureRates; }

    public List<String> getDiagnosticAdvice() { return diagnosticAdvice; }
    public void setDiagnosticAdvice(List<String> diagnosticAdvice) { this.diagnosticAdvice = diagnosticAdvice; }
}

