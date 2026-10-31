package com.codevoyage.lesson;

import com.codevoyage.mission.Mission;
import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false, unique = true)
    private Mission mission;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conceptSummary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String detailedExplanation;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sampleJavaCode;

    @Column(columnDefinition = "TEXT")
    private String keyTakeaways;

    @Column(columnDefinition = "TEXT")
    private String whyNeeded;

    @Column(columnDefinition = "TEXT")
    private String visualRepJson;

    @Column(columnDefinition = "TEXT")
    private String syntaxBreakdownJson;

    @Column(columnDefinition = "TEXT")
    private String commonMistakesJson;

    @Column(columnDefinition = "TEXT")
    private String interactiveSnippet;

    @Column(columnDefinition = "TEXT")
    private String interactiveOptionsJson;

    public Lesson() {}

    public Lesson(Mission mission, String title, String conceptSummary, String detailedExplanation, String sampleJavaCode, String keyTakeaways) {
        this.mission = mission;
        this.title = title;
        this.conceptSummary = conceptSummary;
        this.detailedExplanation = detailedExplanation;
        this.sampleJavaCode = sampleJavaCode;
        this.keyTakeaways = keyTakeaways;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Mission getMission() { return mission; }
    public void setMission(Mission mission) { this.mission = mission; }

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
