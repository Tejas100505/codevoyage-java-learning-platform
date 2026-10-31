package com.codevoyage.mission.dto;

import com.codevoyage.challenge.dto.CodingChallengeDTO;
import com.codevoyage.lesson.dto.LessonDTO;
import com.codevoyage.practice.dto.PracticeQuestionDTO;

import java.util.List;

public class MissionDetailDTO {
    private Long id;
    private Long worldId;
    private String worldName;
    private Integer missionOrder;
    private String title;
    private String slug;
    private String story;
    private String objective;
    private String javaConcept;
    private String shipSystem;
    private Integer xpReward;
    private Integer starsReward;
    private String difficulty;
    private Boolean isBossMission;
    private Long unlockRequirementMissionId;
    private Boolean unlocked;
    private Boolean completed;
    private Integer starsEarned;
    private Integer attempts;
    private Integer hintsUsed;

    private LessonDTO lesson;
    private List<PracticeQuestionDTO> practiceQuestions;
    private CodingChallengeDTO codingChallenge;

    public MissionDetailDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorldId() { return worldId; }
    public void setWorldId(Long worldId) { this.worldId = worldId; }

    public String getWorldName() { return worldName; }
    public void setWorldName(String worldName) { this.worldName = worldName; }

    public Integer getMissionOrder() { return missionOrder; }
    public void setMissionOrder(Integer missionOrder) { this.missionOrder = missionOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getJavaConcept() { return javaConcept; }
    public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }

    public String getShipSystem() { return shipSystem; }
    public void setShipSystem(String shipSystem) { this.shipSystem = shipSystem; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getStarsReward() { return starsReward; }
    public void setStarsReward(Integer starsReward) { this.starsReward = starsReward; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Boolean getIsBossMission() { return isBossMission; }
    public void setIsBossMission(Boolean isBossMission) { this.isBossMission = isBossMission; }

    public Long getUnlockRequirementMissionId() { return unlockRequirementMissionId; }
    public void setUnlockRequirementMissionId(Long unlockRequirementMissionId) { this.unlockRequirementMissionId = unlockRequirementMissionId; }

    public Boolean getUnlocked() { return unlocked; }
    public void setUnlocked(Boolean unlocked) { this.unlocked = unlocked; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getStarsEarned() { return starsEarned; }
    public void setStarsEarned(Integer starsEarned) { this.starsEarned = starsEarned; }

    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }

    public Integer getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(Integer hintsUsed) { this.hintsUsed = hintsUsed; }

    public LessonDTO getLesson() { return lesson; }
    public void setLesson(LessonDTO lesson) { this.lesson = lesson; }

    public List<PracticeQuestionDTO> getPracticeQuestions() { return practiceQuestions; }
    public void setPracticeQuestions(List<PracticeQuestionDTO> practiceQuestions) { this.practiceQuestions = practiceQuestions; }

    public CodingChallengeDTO getCodingChallenge() { return codingChallenge; }
    public void setCodingChallenge(CodingChallengeDTO codingChallenge) { this.codingChallenge = codingChallenge; }
}
