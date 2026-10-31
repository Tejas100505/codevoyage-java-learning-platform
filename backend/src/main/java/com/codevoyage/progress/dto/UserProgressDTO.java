package com.codevoyage.progress.dto;

import java.time.LocalDateTime;

public class UserProgressDTO {
    private Long missionId;
    private String missionTitle;
    private Boolean unlocked;
    private Boolean completed;
    private Integer attempts;
    private Integer stars;
    private Integer xpEarned;
    private Integer hintsUsed;
    private Long completionTimeSeconds;
    private LocalDateTime completedAt;

    public UserProgressDTO() {}

    public UserProgressDTO(Long missionId, String missionTitle, Boolean unlocked, Boolean completed, Integer attempts, Integer stars, Integer xpEarned, Integer hintsUsed, Long completionTimeSeconds, LocalDateTime completedAt) {
        this.missionId = missionId;
        this.missionTitle = missionTitle;
        this.unlocked = unlocked;
        this.completed = completed;
        this.attempts = attempts;
        this.stars = stars;
        this.xpEarned = xpEarned;
        this.hintsUsed = hintsUsed;
        this.completionTimeSeconds = completionTimeSeconds;
        this.completedAt = completedAt;
    }

    public Long getMissionId() { return missionId; }
    public void setMissionId(Long missionId) { this.missionId = missionId; }

    public String getMissionTitle() { return missionTitle; }
    public void setMissionTitle(String missionTitle) { this.missionTitle = missionTitle; }

    public Boolean getUnlocked() { return unlocked; }
    public void setUnlocked(Boolean unlocked) { this.unlocked = unlocked; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public Integer getXpEarned() { return xpEarned; }
    public void setXpEarned(Integer xpEarned) { this.xpEarned = xpEarned; }

    public Integer getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(Integer hintsUsed) { this.hintsUsed = hintsUsed; }

    public Long getCompletionTimeSeconds() { return completionTimeSeconds; }
    public void setCompletionTimeSeconds(Long completionTimeSeconds) { this.completionTimeSeconds = completionTimeSeconds; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
