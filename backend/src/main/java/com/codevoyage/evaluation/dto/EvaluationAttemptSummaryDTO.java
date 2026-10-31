package com.codevoyage.evaluation.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class EvaluationAttemptSummaryDTO {
    private String testType;
    private int score;
    private int totalQuestions;
    private double scorePercentage;
    private long timeSpentSeconds;
    private LocalDateTime submittedAt;
    private Map<String, Integer> conceptScores; // e.g. "basicSyntax": 1, "variables": 1, etc.

    public EvaluationAttemptSummaryDTO() {}

    public EvaluationAttemptSummaryDTO(String testType, int score, int totalQuestions, double scorePercentage, long timeSpentSeconds, LocalDateTime submittedAt, Map<String, Integer> conceptScores) {
        this.testType = testType;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.scorePercentage = scorePercentage;
        this.timeSpentSeconds = timeSpentSeconds;
        this.submittedAt = submittedAt;
        this.conceptScores = conceptScores;
    }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage != null ? scorePercentage : 0.0; }

    public long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds != null ? timeSpentSeconds : 0L; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Map<String, Integer> getConceptScores() { return conceptScores; }
    public void setConceptScores(Map<String, Integer> conceptScores) { this.conceptScores = conceptScores; }
}
