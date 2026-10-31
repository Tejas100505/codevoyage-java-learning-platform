package com.codevoyage.progress.dto;

public class MissionCompleteRequest {
    private int stars;
    private int xpEarned;
    private long durationSeconds;

    public MissionCompleteRequest() {}

    public MissionCompleteRequest(int stars, int xpEarned, long durationSeconds) {
        this.stars = stars;
        this.xpEarned = xpEarned;
        this.durationSeconds = durationSeconds;
    }

    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public long getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(long durationSeconds) { this.durationSeconds = durationSeconds; }
}
