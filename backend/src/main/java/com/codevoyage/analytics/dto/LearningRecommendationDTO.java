package com.codevoyage.analytics.dto;

public class LearningRecommendationDTO {
    private String id;
    private String conceptKey;
    private String conceptName;
    private String category;
    private String type;            // SYNTAX_DRILL, LOGIC_REVIEW, CHALLENGE_ADVANCE, HINT_REDUCTION, PRACTICE_DRILL
    private String priority;        // HIGH, MEDIUM, LOW
    private String reason;
    private String supportingMetric;
    private Long targetMissionId;
    private String targetMissionTitle;
    private String recommendedResource;
    private String actionUrl;
    private String actionText;
    private boolean completed;
    private String subsequentImprovement;

    public LearningRecommendationDTO() {}

    public LearningRecommendationDTO(
            String id,
            String conceptKey,
            String conceptName,
            String category,
            String type,
            String priority,
            String reason,
            String supportingMetric,
            Long targetMissionId,
            String targetMissionTitle,
            String recommendedResource,
            String actionUrl,
            String actionText,
            boolean completed,
            String subsequentImprovement
    ) {
        this.id = id;
        this.conceptKey = conceptKey;
        this.conceptName = conceptName;
        this.category = category;
        this.type = type;
        this.priority = priority;
        this.reason = reason;
        this.supportingMetric = supportingMetric;
        this.targetMissionId = targetMissionId;
        this.targetMissionTitle = targetMissionTitle;
        this.recommendedResource = recommendedResource;
        this.actionUrl = actionUrl;
        this.actionText = actionText;
        this.completed = completed;
        this.subsequentImprovement = subsequentImprovement;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConceptKey() { return conceptKey; }
    public void setConceptKey(String conceptKey) { this.conceptKey = conceptKey; }

    public String getConceptName() { return conceptName; }
    public void setConceptName(String conceptName) { this.conceptName = conceptName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getSupportingMetric() { return supportingMetric; }
    public void setSupportingMetric(String supportingMetric) { this.supportingMetric = supportingMetric; }

    public Long getTargetMissionId() { return targetMissionId; }
    public void setTargetMissionId(Long targetMissionId) { this.targetMissionId = targetMissionId; }

    public String getTargetMissionTitle() { return targetMissionTitle; }
    public void setTargetMissionTitle(String targetMissionTitle) { this.targetMissionTitle = targetMissionTitle; }

    public String getRecommendedResource() { return recommendedResource; }
    public void setRecommendedResource(String recommendedResource) { this.recommendedResource = recommendedResource; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public String getActionText() { return actionText; }
    public void setActionText(String actionText) { this.actionText = actionText; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getSubsequentImprovement() { return subsequentImprovement; }
    public void setSubsequentImprovement(String subsequentImprovement) { this.subsequentImprovement = subsequentImprovement; }
}

