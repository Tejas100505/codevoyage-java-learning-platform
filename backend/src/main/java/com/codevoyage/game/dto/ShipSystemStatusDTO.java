package com.codevoyage.game.dto;

public class ShipSystemStatusDTO {
    private String systemKey; // POWER_CORE, SENSOR_SYSTEM, COMMUNICATION_ARRAY, ENGINE_SYSTEM, NAVIGATION_SYSTEM, etc.
    private String displayName; // "Power Core", "Sensor System", etc.
    private String javaConcept; // "Variables", "Data Types", etc.
    private int powerPercentage; // 0 - 100%
    private String status; // DAMAGED, PARTIALLY_ACTIVE, ONLINE, OVERCHARGED
    private String description;
    private String visualEffect; // "pulsing-red", "amber-flicker", "cyan-active-glow", "emerald-power-surge"
    private boolean lightsOn;
    private boolean energyFlowing;
    private boolean engineActive;

    public ShipSystemStatusDTO() {}

    public ShipSystemStatusDTO(String systemKey, String displayName, String javaConcept, int powerPercentage, String status, String description, String visualEffect, boolean lightsOn, boolean energyFlowing, boolean engineActive) {
        this.systemKey = systemKey;
        this.displayName = displayName;
        this.javaConcept = javaConcept;
        this.powerPercentage = powerPercentage;
        this.status = status;
        this.description = description;
        this.visualEffect = visualEffect;
        this.lightsOn = lightsOn;
        this.energyFlowing = energyFlowing;
        this.engineActive = engineActive;
    }

    public String getSystemKey() { return systemKey; }
    public void setSystemKey(String systemKey) { this.systemKey = systemKey; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getJavaConcept() { return javaConcept; }
    public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }

    public int getPowerPercentage() { return powerPercentage; }
    public void setPowerPercentage(int powerPercentage) { this.powerPercentage = powerPercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVisualEffect() { return visualEffect; }
    public void setVisualEffect(String visualEffect) { this.visualEffect = visualEffect; }

    public boolean isLightsOn() { return lightsOn; }
    public void setLightsOn(boolean lightsOn) { this.lightsOn = lightsOn; }

    public boolean isEnergyFlowing() { return energyFlowing; }
    public void setEnergyFlowing(boolean energyFlowing) { this.energyFlowing = energyFlowing; }

    public boolean isEngineActive() { return engineActive; }
    public void setEngineActive(boolean engineActive) { this.engineActive = engineActive; }
}
