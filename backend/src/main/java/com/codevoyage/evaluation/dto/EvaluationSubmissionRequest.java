package com.codevoyage.evaluation.dto;

import java.util.Map;

public class EvaluationSubmissionRequest {
    private String testType; // PRE_TEST or POST_TEST
    private Map<String, Integer> answers; // questionId -> selectedOptionIndex (0-3)
    private Long timeSpentSeconds;

    public EvaluationSubmissionRequest() {}

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public Map<String, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<String, Integer> answers) { this.answers = answers; }

    public Long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
