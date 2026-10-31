package com.codevoyage.mission.dto;

public class MissionSummaryDTO {
    private Long id;
    private Integer missionOrder;
    private String title;
    private String slug;
    private String objective;
    private String javaConcept;
    private Integer xpReward;
    private Integer starsReward;
    private String difficulty;
    private Boolean unlocked;
    private Boolean completed;
    private Integer starsEarned;

    public MissionSummaryDTO() {}

    public MissionSummaryDTO(Long id, Integer missionOrder, String title, String slug, String objective, String javaConcept, Integer xpReward, Integer starsReward, String difficulty, Boolean unlocked, Boolean completed, Integer starsEarned) {
        this.id = id;
        this.missionOrder = missionOrder;
        this.title = title;
        this.slug = slug;
        this.objective = objective;
        this.javaConcept = javaConcept;
        this.xpReward = xpReward;
        this.starsReward = starsReward;
        this.difficulty = difficulty;
        this.unlocked = unlocked;
        this.completed = completed;
        this.starsEarned = starsEarned;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getMissionOrder() { return missionOrder; }
    public void setMissionOrder(Integer missionOrder) { this.missionOrder = missionOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getJavaConcept() { return javaConcept; }
    public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getStarsReward() { return starsReward; }
    public void setStarsReward(Integer starsReward) { this.starsReward = starsReward; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Boolean getUnlocked() { return unlocked; }
    public void setUnlocked(Boolean unlocked) { this.unlocked = unlocked; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getStarsEarned() { return starsEarned; }
    public void setStarsEarned(Integer starsEarned) { this.starsEarned = starsEarned; }
}
