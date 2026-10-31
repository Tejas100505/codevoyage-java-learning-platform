package com.codevoyage.progress;

import com.codevoyage.mission.Mission;
import com.codevoyage.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "mission_id"})
)
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @Column(nullable = false)
    private Boolean unlocked = false;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(nullable = false)
    private Integer stars = 0;

    @Column(name = "lesson_completed", nullable = false)
    private Boolean lessonCompleted = false;

    @Column(name = "practice_completed", nullable = false)
    private Boolean practiceCompleted = false;

    @Column(name = "xp_earned", nullable = false)
    private Integer xpEarned = 0;

    @Column(name = "hints_used", nullable = false)
    private Integer hintsUsed = 0;

    @Column(name = "completion_time_seconds")
    private Long completionTimeSeconds;

    @Column(name = "last_attempted_at")
    private LocalDateTime lastAttemptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public UserProgress() {}

    public UserProgress(User user, Mission mission, Boolean unlocked) {
        this.user = user;
        this.mission = mission;
        this.unlocked = unlocked != null ? unlocked : false;
        this.completed = false;
        this.attempts = 0;
        this.stars = 0;
        this.xpEarned = 0;
        this.hintsUsed = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Mission getMission() { return mission; }
    public void setMission(Mission mission) { this.mission = mission; }

    public Boolean getUnlocked() { return unlocked; }
    public void setUnlocked(Boolean unlocked) { this.unlocked = unlocked; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }

    public Boolean getLessonCompleted() { return lessonCompleted; }
    public void setLessonCompleted(Boolean lessonCompleted) { this.lessonCompleted = lessonCompleted; }

    public Boolean getPracticeCompleted() { return practiceCompleted; }
    public void setPracticeCompleted(Boolean practiceCompleted) { this.practiceCompleted = practiceCompleted; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public Integer getXpEarned() { return xpEarned; }
    public void setXpEarned(Integer xpEarned) { this.xpEarned = xpEarned; }

    public Integer getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(Integer hintsUsed) { this.hintsUsed = hintsUsed; }

    public Long getCompletionTimeSeconds() { return completionTimeSeconds; }
    public void setCompletionTimeSeconds(Long completionTimeSeconds) { this.completionTimeSeconds = completionTimeSeconds; }

    public LocalDateTime getLastAttemptedAt() { return lastAttemptedAt; }
    public void setLastAttemptedAt(LocalDateTime lastAttemptedAt) { this.lastAttemptedAt = lastAttemptedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
