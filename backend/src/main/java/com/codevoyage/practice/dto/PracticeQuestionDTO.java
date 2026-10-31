package com.codevoyage.practice.dto;

public class PracticeQuestionDTO {
    private Long id;
    private Integer questionNumber;
    private String prompt;
    private String codeSnippet;
    private String optionsJson;
    private Integer correctAnswerIndex;
    private String explanation;
    private String activityType;
    private String activityDataJson;
    private String hint;

    public PracticeQuestionDTO() {}

    public PracticeQuestionDTO(Long id, Integer questionNumber, String prompt, String codeSnippet, String optionsJson, Integer correctAnswerIndex, String explanation) {
        this.id = id;
        this.questionNumber = questionNumber;
        this.prompt = prompt;
        this.codeSnippet = codeSnippet;
        this.optionsJson = optionsJson;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
        this.activityType = "MULTIPLE_CHOICE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
