package com.codevoyage.game.dto;

import java.util.List;
import java.util.Map;

/**
 * Reusable GameState DTO representing the state of all starship subsystems
 * dynamically linked to Java learning and coding outcomes.
 */
public class GameStateDTO {

    private String username;
    private int currentSector;
    private int overallIntegrity; // 0 - 100%
    private String activeShipName;
    private List<ShipSystemStatusDTO> systems;
    private Map<String, Object> environmentVisuals;

    public GameStateDTO() {}

    public GameStateDTO(String username, int currentSector, int overallIntegrity, String activeShipName, List<ShipSystemStatusDTO> systems, Map<String, Object> environmentVisuals) {
        this.username = username;
        this.currentSector = currentSector;
        this.overallIntegrity = overallIntegrity;
        this.activeShipName = activeShipName;
        this.systems = systems;
        this.environmentVisuals = environmentVisuals;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getCurrentSector() { return currentSector; }
    public void setCurrentSector(int currentSector) { this.currentSector = currentSector; }

    public int getOverallIntegrity() { return overallIntegrity; }
    public void setOverallIntegrity(int overallIntegrity) { this.overallIntegrity = overallIntegrity; }

    public String getActiveShipName() { return activeShipName; }
    public void setActiveShipName(String activeShipName) { this.activeShipName = activeShipName; }

    public List<ShipSystemStatusDTO> getSystems() { return systems; }
    public void setSystems(List<ShipSystemStatusDTO> systems) { this.systems = systems; }

    public Map<String, Object> getEnvironmentVisuals() { return environmentVisuals; }
    public void setEnvironmentVisuals(Map<String, Object> environmentVisuals) { this.environmentVisuals = environmentVisuals; }
}
