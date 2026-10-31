package com.codevoyage.lesson.dto;

public class LessonDTO {
    private Long id;
    private String title;
    private String conceptSummary;
    private String detailedExplanation;
    private String sampleJavaCode;
    private String keyTakeaways;
    private String whyNeeded;
    private String visualRepJson;
    private String syntaxBreakdownJson;
    private String commonMistakesJson;
    private String interactiveSnippet;
    private String interactiveOptionsJson;

    public LessonDTO() {}

    public LessonDTO(Long id, String title, String conceptSummary, String detailedExplanation, String sampleJavaCode, String keyTakeaways) {
        this.id = id;
        this.title = title;
        this.conceptSummary = conceptSummary;
        this.detailedExplanation = detailedExplanation;
        this.sampleJavaCode = sampleJavaCode;
        this.keyTakeaways = keyTakeaways;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getConceptSummary() { return conceptSummary; }
    public void setConceptSummary(String conceptSummary) { this.conceptSummary = conceptSummary; }

    public String getDetailedExplanation() { return detailedExplanation; }
    public void setDetailedExplanation(String detailedExplanation) { this.detailedExplanation = detailedExplanation; }

    public String getSampleJavaCode() { return sampleJavaCode; }
    public void setSampleJavaCode(String sampleJavaCode) { this.sampleJavaCode = sampleJavaCode; }

    public String getKeyTakeaways() { return keyTakeaways; }
    public void setKeyTakeaways(String keyTakeaways) { this.keyTakeaways = keyTakeaways; }

    public String getWhyNeeded() { return whyNeeded; }
    public void setWhyNeeded(String whyNeeded) { this.whyNeeded = whyNeeded; }

    public String getVisualRepJson() { return visualRepJson; }
    public void setVisualRepJson(String visualRepJson) { this.visualRepJson = visualRepJson; }

    public String getSyntaxBreakdownJson() { return syntaxBreakdownJson; }
    public void setSyntaxBreakdownJson(String syntaxBreakdownJson) { this.syntaxBreakdownJson = syntaxBreakdownJson; }

    public String getCommonMistakesJson() { return commonMistakesJson; }
    public void setCommonMistakesJson(String commonMistakesJson) { this.commonMistakesJson = commonMistakesJson; }

    public String getInteractiveSnippet() { return interactiveSnippet; }
    public void setInteractiveSnippet(String interactiveSnippet) { this.interactiveSnippet = interactiveSnippet; }

    public String getInteractiveOptionsJson() { return interactiveOptionsJson; }
    public void setInteractiveOptionsJson(String interactiveOptionsJson) { this.interactiveOptionsJson = interactiveOptionsJson; }
}
