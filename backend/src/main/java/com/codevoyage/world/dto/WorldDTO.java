package com.codevoyage.world.dto;

import com.codevoyage.mission.dto.MissionSummaryDTO;

import java.util.List;

public class WorldDTO {
    private Long id;
    private Integer worldOrder;
    private String slug;
    private String name;
    private String theme;
    private String lore;
    private Boolean unlockedByDefault;
    private Boolean unlocked = false;
    private Boolean completed = false;
    private Integer clearedMissionsCount = 0;
    private Integer totalMissionsCount = 0;
    private String requiredWorldName;
    private Integer requiredWorldOrder;
    private String unlockRequirementText;
    private List<MissionSummaryDTO> missions;

    public WorldDTO() {}

    public WorldDTO(Long id, Integer worldOrder, String slug, String name, String theme, String lore, Boolean unlockedByDefault, List<MissionSummaryDTO> missions) {
        this.id = id;
        this.worldOrder = worldOrder;
        this.slug = slug;
        this.name = name;
        this.theme = theme;
        this.lore = lore;
        this.unlockedByDefault = unlockedByDefault;
        this.unlocked = unlockedByDefault != null && unlockedByDefault;
        this.missions = missions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getWorldOrder() { return worldOrder; }
    public void setWorldOrder(Integer worldOrder) { this.worldOrder = worldOrder; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getLore() { return lore; }
    public void setLore(String lore) { this.lore = lore; }

    public Boolean getUnlockedByDefault() { return unlockedByDefault; }
    public void setUnlockedByDefault(Boolean unlockedByDefault) { this.unlockedByDefault = unlockedByDefault; }

    public Boolean getUnlocked() { return unlocked; }
    public void setUnlocked(Boolean unlocked) { this.unlocked = unlocked; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getClearedMissionsCount() { return clearedMissionsCount; }
    public void setClearedMissionsCount(Integer clearedMissionsCount) { this.clearedMissionsCount = clearedMissionsCount; }

    public Integer getTotalMissionsCount() { return totalMissionsCount; }
    public void setTotalMissionsCount(Integer totalMissionsCount) { this.totalMissionsCount = totalMissionsCount; }

    public String getRequiredWorldName() { return requiredWorldName; }
    public void setRequiredWorldName(String requiredWorldName) { this.requiredWorldName = requiredWorldName; }

    public Integer getRequiredWorldOrder() { return requiredWorldOrder; }
    public void setRequiredWorldOrder(Integer requiredWorldOrder) { this.requiredWorldOrder = requiredWorldOrder; }

    public String getUnlockRequirementText() { return unlockRequirementText; }
    public void setUnlockRequirementText(String unlockRequirementText) { this.unlockRequirementText = unlockRequirementText; }

    public List<MissionSummaryDTO> getMissions() { return missions; }
    public void setMissions(List<MissionSummaryDTO> missions) { this.missions = missions; }
}
