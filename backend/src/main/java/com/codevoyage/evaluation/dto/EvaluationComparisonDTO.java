package com.codevoyage.evaluation.dto;

import java.util.Map;

public class EvaluationComparisonDTO {
    private boolean preTestCompleted;
    private boolean postTestCompleted;
    private boolean canTakePostTest;
    private String postTestLockedReason;

    private EvaluationAttemptSummaryDTO preTest;
    private EvaluationAttemptSummaryDTO postTest;

    private double scoreImprovementPercentage;   // e.g. +33.3%
    private int absoluteScoreGain;                // e.g. +2 points
    private Map<String, Integer> conceptGains;    // syntax gain, variables gain, etc.
    private String learningOutcomeSummary;       // qualitative evaluation verdict

    public EvaluationComparisonDTO() {}

    public boolean isPreTestCompleted() { return preTestCompleted; }
    public void setPreTestCompleted(boolean preTestCompleted) { this.preTestCompleted = preTestCompleted; }

    public boolean isPostTestCompleted() { return postTestCompleted; }
    public void setPostTestCompleted(boolean postTestCompleted) { this.postTestCompleted = postTestCompleted; }

    public boolean isCanTakePostTest() { return canTakePostTest; }
    public void setCanTakePostTest(boolean canTakePostTest) { this.canTakePostTest = canTakePostTest; }

    public String getPostTestLockedReason() { return postTestLockedReason; }
    public void setPostTestLockedReason(String postTestLockedReason) { this.postTestLockedReason = postTestLockedReason; }

    public EvaluationAttemptSummaryDTO getPreTest() { return preTest; }
    public void setPreTest(EvaluationAttemptSummaryDTO preTest) { this.preTest = preTest; }

    public EvaluationAttemptSummaryDTO getPostTest() { return postTest; }
    public void setPostTest(EvaluationAttemptSummaryDTO postTest) { this.postTest = postTest; }

    public double getScoreImprovementPercentage() { return scoreImprovementPercentage; }
    public void setScoreImprovementPercentage(double scoreImprovementPercentage) { this.scoreImprovementPercentage = scoreImprovementPercentage; }

    public int getAbsoluteScoreGain() { return absoluteScoreGain; }
    public void setAbsoluteScoreGain(int absoluteScoreGain) { this.absoluteScoreGain = absoluteScoreGain; }

    public Map<String, Integer> getConceptGains() { return conceptGains; }
    public void setConceptGains(Map<String, Integer> conceptGains) { this.conceptGains = conceptGains; }

    public String getLearningOutcomeSummary() { return learningOutcomeSummary; }
    public void setLearningOutcomeSummary(String learningOutcomeSummary) { this.learningOutcomeSummary = learningOutcomeSummary; }
}
