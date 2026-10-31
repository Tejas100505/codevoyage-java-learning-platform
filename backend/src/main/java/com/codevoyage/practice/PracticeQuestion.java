package com.codevoyage.practice;

import com.codevoyage.mission.Mission;
import jakarta.persistence.*;

@Entity
@Table(name = "practice_questions")
public class PracticeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @Column(nullable = false)
    private Integer questionNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String optionsJson; // JSON array of options: ["Option A", "Option B", ...]

    @Column(nullable = false)
    private Integer correctAnswerIndex;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false, length = 40)
    private String activityType = "MULTIPLE_CHOICE"; // MULTIPLE_CHOICE, PREDICT_OUTPUT, FILL_CODE, DEBUG_CODE, MATCH_CONCEPT, REORDER_CODE, CHANGE_VALUE, SHORT_TASK

    @Column(columnDefinition = "TEXT")
    private String activityDataJson;

    @Column(columnDefinition = "TEXT")
    private String hint;

    public PracticeQuestion() {}

    public PracticeQuestion(Mission mission, Integer questionNumber, String prompt, String codeSnippet, String optionsJson, Integer correctAnswerIndex, String explanation) {
        this.mission = mission;
        this.questionNumber = questionNumber;
        this.prompt = prompt;
        this.codeSnippet = codeSnippet;
        this.optionsJson = optionsJson;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
        this.activityType = "MULTIPLE_CHOICE";
    }

    public PracticeQuestion(Mission mission, Integer questionNumber, String prompt, String codeSnippet, String optionsJson, Integer correctAnswerIndex, String explanation, String activityType, String activityDataJson, String hint) {
        this.mission = mission;
        this.questionNumber = questionNumber;
        this.prompt = prompt;
        this.codeSnippet = codeSnippet;
        this.optionsJson = optionsJson;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
        this.activityType = activityType != null ? activityType : "MULTIPLE_CHOICE";
        this.activityDataJson = activityDataJson;
        this.hint = hint;
    }

    public PracticeQuestion(Mission mission, Integer questionNumber, String activityType, String prompt, String codeSnippet, String optionsJson, Integer correctAnswerIndex, String explanation, String hint, String activityDataJson) {
        this.mission = mission;
        this.questionNumber = questionNumber;
        this.activityType = activityType != null ? activityType : "MULTIPLE_CHOICE";
        this.prompt = prompt;
        this.codeSnippet = codeSnippet;
        this.optionsJson = optionsJson;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
        this.hint = hint;
        this.activityDataJson = activityDataJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Mission getMission() { return mission; }
    public void setMission(Mission mission) { this.mission = mission; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public Integer getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(Integer correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getActivityDataJson() { return activityDataJson; }
    public void setActivityDataJson(String activityDataJson) { this.activityDataJson = activityDataJson; }

    public String getHint() { return hint; }
    public void setHint(String hint) { this.hint = hint; }
}
