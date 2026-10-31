package com.codevoyage.submission.dto;

import java.time.LocalDateTime;

public class SubmissionDTO {
    private Long id;
    private Long challengeId;
    private String challengeTitle;
    private String sourceCode;
    private String status;
    private String executionResult;
    private Long executionTimeMs;
    private LocalDateTime submittedAt;

    public SubmissionDTO() {}

    public SubmissionDTO(Long id, Long challengeId, String challengeTitle, String sourceCode, String status, String executionResult, Long executionTimeMs, LocalDateTime submittedAt) {
        this.id = id;
        this.challengeId = challengeId;
        this.challengeTitle = challengeTitle;
        this.sourceCode = sourceCode;
        this.status = status;
        this.executionResult = executionResult;
        this.executionTimeMs = executionTimeMs;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChallengeId() { return challengeId; }
    public void setChallengeId(Long challengeId) { this.challengeId = challengeId; }

    public String getChallengeTitle() { return challengeTitle; }
    public void setChallengeTitle(String challengeTitle) { this.challengeTitle = challengeTitle; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExecutionResult() { return executionResult; }
    public void setExecutionResult(String executionResult) { this.executionResult = executionResult; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
