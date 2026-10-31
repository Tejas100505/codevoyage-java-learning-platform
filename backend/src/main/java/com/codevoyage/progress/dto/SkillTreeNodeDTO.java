package com.codevoyage.progress.dto;

import java.util.List;

public class SkillTreeNodeDTO {
    private String id;
    private String name;
    private String category;
    private String state; // "LOCKED", "AVAILABLE", "IN_PROGRESS", "MASTERED"
    private int masteryPercent; // 0 to 100
    private String description;
    private String whatWasLearned;
    private List<String> missionsCompleted;
    private List<String> codingChallenges;
    private String codexEntryId;
    private Long targetMissionId;
    private List<String> parentIds;

    public SkillTreeNodeDTO() {}

    public SkillTreeNodeDTO(
            String id,
            String name,
            String category,
            String state,
            int masteryPercent,
            String description,
            String whatWasLearned,
            List<String> missionsCompleted,
            List<String> codingChallenges,
            String codexEntryId,
            Long targetMissionId,
            List<String> parentIds
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.state = state;
        this.masteryPercent = masteryPercent;
        this.description = description;
        this.whatWasLearned = whatWasLearned;
        this.missionsCompleted = missionsCompleted;
        this.codingChallenges = codingChallenges;
        this.codexEntryId = codexEntryId;
        this.targetMissionId = targetMissionId;
        this.parentIds = parentIds;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public int getMasteryPercent() { return masteryPercent; }
    public void setMasteryPercent(int masteryPercent) { this.masteryPercent = masteryPercent; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWhatWasLearned() { return whatWasLearned; }
    public void setWhatWasLearned(String whatWasLearned) { this.whatWasLearned = whatWasLearned; }

    public List<String> getMissionsCompleted() { return missionsCompleted; }
    public void setMissionsCompleted(List<String> missionsCompleted) { this.missionsCompleted = missionsCompleted; }

    public List<String> getCodingChallenges() { return codingChallenges; }
    public void setCodingChallenges(List<String> codingChallenges) { this.codingChallenges = codingChallenges; }

    public String getCodexEntryId() { return codexEntryId; }
    public void setCodexEntryId(String codexEntryId) { this.codexEntryId = codexEntryId; }

    public Long getTargetMissionId() { return targetMissionId; }
    public void setTargetMissionId(Long targetMissionId) { this.targetMissionId = targetMissionId; }

    public List<String> getParentIds() { return parentIds; }
    public void setParentIds(List<String> parentIds) { this.parentIds = parentIds; }
}
