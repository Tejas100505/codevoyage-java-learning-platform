package com.codevoyage.submission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private CodingChallenge challenge;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sourceCode;

    @Column(nullable = false, length = 30)
    private String status; // SUCCESS, COMPILE_ERROR, RUNTIME_ERROR, TIMEOUT, WRONG_ANSWER

    @Column(columnDefinition = "TEXT")
    private String executionResult;

    @Column(name = "execution_time_ms")
    private Long executionTimeMs;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public Submission() {}

    public Submission(User user, CodingChallenge challenge, String sourceCode, String status, String executionResult, Long executionTimeMs) {
        this.user = user;
        this.challenge = challenge;
        this.sourceCode = sourceCode;
        this.status = status;
        this.executionResult = executionResult;
        this.executionTimeMs = executionTimeMs;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public CodingChallenge getChallenge() { return challenge; }
    public void setChallenge(CodingChallenge challenge) { this.challenge = challenge; }

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
