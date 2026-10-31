package com.codevoyage.evaluation;

import com.codevoyage.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_attempts")
public class EvaluationAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "test_type", nullable = false, length = 20)
    private String testType; // PRE_TEST or POST_TEST

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 6;

    @Column(name = "score", nullable = false)
    private Integer score = 0;

    @Column(name = "score_percentage", nullable = false)
    private Double scorePercentage = 0.0;

    @Column(name = "syntax_score", nullable = false)
    private Integer syntaxScore = 0;

    @Column(name = "variables_score", nullable = false)
    private Integer variablesScore = 0;

    @Column(name = "data_types_score", nullable = false)
    private Integer dataTypesScore = 0;

    @Column(name = "input_score", nullable = false)
    private Integer inputScore = 0;

    @Column(name = "operators_score", nullable = false)
    private Integer operatorsScore = 0;

    @Column(name = "conditions_score", nullable = false)
    private Integer conditionsScore = 0;

    @Column(name = "time_spent_seconds")
    private Long timeSpentSeconds = 0L;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson; // Cadet answers map

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public EvaluationAttempt() {}

    public EvaluationAttempt(User user, String testType, Integer totalQuestions, Integer score, Double scorePercentage) {
        this.user = user;
        this.testType = testType;
        this.totalQuestions = totalQuestions;
        this.score = score;
        this.scorePercentage = scorePercentage;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; }

    public Integer getSyntaxScore() { return syntaxScore; }
    public void setSyntaxScore(Integer syntaxScore) { this.syntaxScore = syntaxScore; }

    public Integer getVariablesScore() { return variablesScore; }
    public void setVariablesScore(Integer variablesScore) { this.variablesScore = variablesScore; }

    public Integer getDataTypesScore() { return dataTypesScore; }
    public void setDataTypesScore(Integer dataTypesScore) { this.dataTypesScore = dataTypesScore; }

    public Integer getInputScore() { return inputScore; }
    public void setInputScore(Integer inputScore) { this.inputScore = inputScore; }

    public Integer getOperatorsScore() { return operatorsScore; }
    public void setOperatorsScore(Integer operatorsScore) { this.operatorsScore = operatorsScore; }

    public Integer getConditionsScore() { return conditionsScore; }
    public void setConditionsScore(Integer conditionsScore) { this.conditionsScore = conditionsScore; }

    public Long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }

    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
