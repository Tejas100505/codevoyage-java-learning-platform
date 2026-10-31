package com.codevoyage.game;

import com.codevoyage.game.dto.GameStateDTO;
import com.codevoyage.game.dto.ShipSystemStatusDTO;
import com.codevoyage.mission.Mission;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.UserProgress;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class GameStateService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final MissionRepository missionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GameStateService(
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            MissionRepository missionRepository
    ) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.missionRepository = missionRepository;
    }

    /**
     * Compute and return the persistent GameState for the user.
     * System mapping:
     * - Java Basics -> Ship Console
     * - Variables -> Power Core
     * - Data Types -> Sensor System
     * - Input / Scanner -> Communication Array
     * - Operators -> Engine System
     * - Conditions -> Navigation System
     * - Loops -> Automation System
     * - Methods -> Ship Control System
     * - Arrays -> Cargo / Data System
     * - OOP -> Ship AI
     */
    @Transactional
    public GameStateDTO getGameState(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return getDefaultGameState("Cadet");
        }

        List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
        Map<Long, UserProgress> progressByMission = new HashMap<>();
        for (UserProgress up : userProgressList) {
            progressByMission.put(up.getMission().getId(), up);
        }

        // Fetch overrides stored in user.shipSystemsStateJson if any
        Map<String, Integer> systemOverrides = parseOverrides(user.getShipSystemsStateJson());

        List<ShipSystemStatusDTO> systems = new ArrayList<>();

        // 1. SHIP_CONSOLE (Java Basics - Mission 1)
        systems.add(calculateSystemStatus(
                "SHIP_CONSOLE",
                "Ship Mainframe Console",
                "Java Basics",
                1L,
                progressByMission,
                systemOverrides,
                "Central interface terminal and system boot sequence."
        ));

        // 2. POWER_CORE (Variables - Mission 2)
        systems.add(calculateSystemStatus(
                "POWER_CORE",
                "Fusion Power Core",
                "Variables",
                2L,
                progressByMission,
                systemOverrides,
                "Primary reactor providing electrical charge and fuel conduits across the starship."
        ));

        // 3. SENSOR_SYSTEM (Data Types - Mission 2)
        systems.add(calculateSystemStatus(
                "SENSOR_SYSTEM",
                "External Sensor Array",
                "Data Types",
                2L,
                progressByMission,
                systemOverrides,
                "Calibrates scientific scanners, temperature readouts, and shield telemetry."
        ));

        // 4. COMMUNICATION_ARRAY (Input / Scanner - Mission 3)
        systems.add(calculateSystemStatus(
                "COMMUNICATION_ARRAY",
                "Subspace Communication Array",
                "Input / Scanner",
                3L,
                progressByMission,
                systemOverrides,
                "Transceives live subspace telemetry, incoming commands, and token packets."
        ));

        // 5. ENGINE_SYSTEM (Operators - Mission 4)
        systems.add(calculateSystemStatus(
                "ENGINE_SYSTEM",
                "Orbital Thruster & Engine System",
                "Operators",
                4L,
                progressByMission,
                systemOverrides,
                "Regulates propellant burn cycles, orbital maneuvers, and cyclical impulse bursts."
        ));

        // 6. NAVIGATION_SYSTEM (Conditions - Mission 5)
        systems.add(calculateSystemStatus(
                "NAVIGATION_SYSTEM",
                "Navigation & Emergency Protocol",
                "Conditions",
                5L,
                progressByMission,
                systemOverrides,
                "Evaluates bulkhead interlocks, environmental hazards, and pathfinding branches."
        ));

        // 7. AUTOMATION_SYSTEM (Loops - Future / Unlocked in Sector 3)
        systems.add(calculateSystemStatus(
                "AUTOMATION_SYSTEM",
                "Automation & Cycle System",
                "Loops",
                null,
                progressByMission,
                systemOverrides,
                "Manages continuous system cycles, automated patrol loops, and feedback sweeps."
        ));

        // 8. SHIP_CONTROL_SYSTEM (Methods - Future / Unlocked in Sector 4)
        systems.add(calculateSystemStatus(
                "SHIP_CONTROL_SYSTEM",
                "Modular Ship Control System",
                "Methods",
                null,
                progressByMission,
                systemOverrides,
                "Encapsulates flight control routines, reusable maneuver macros, and safety procedures."
        ));

        // 9. CARGO_DATA_SYSTEM (Arrays - Future / Sector 4)
        systems.add(calculateSystemStatus(
                "CARGO_DATA_SYSTEM",
                "Cargo & Buffer Matrix",
                "Arrays",
                null,
                progressByMission,
                systemOverrides,
                "Indexes cargo containers, telemetry matrices, and multi-element memory arrays."
        ));

        // 10. SHIP_AI (OOP - Future / Sector 5)
        systems.add(calculateSystemStatus(
                "SHIP_AI",
                "B.Y.T.E. Autonomous Ship AI",
                "OOP",
                null,
                progressByMission,
                systemOverrides,
                "Autonomous neural AI architecture coordinating starfleet fleet intelligence."
        ));

        // Calculate overall integrity
        int totalSum = systems.stream().mapToInt(ShipSystemStatusDTO::getPowerPercentage).sum();
        int overallIntegrity = totalSum / systems.size();

        Map<String, Object> visuals = Map.of(
                "ambientLighting", overallIntegrity > 50 ? "CYAN_NOMINAL" : "AMBER_ALERT",
                "hullStatus", overallIntegrity >= 80 ? "PRISTINE" : (overallIntegrity >= 40 ? "CALIBRATING" : "CRITICAL_OFFLINE"),
                "reactorHumVolume", (double) overallIntegrity / 100.0,
                "emergencySirens", overallIntegrity < 20
        );

        return new GameStateDTO(
                user.getUsername(),
                user.getCurrentSector() != null ? user.getCurrentSector() : 1,
                overallIntegrity,
                "USS Vanguard (NCC-1701)",
                systems,
                visuals
        );
    }

    /**
     * Persist an interactive progress update for a specific subsystem.
     * E.g. when student completes practice on Variables, system goes to 60%.
     * When student completes challenge, system goes to 100%.
     */
    @Transactional
    public GameStateDTO updateSystemState(String username, String systemKey, int powerPercentage) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return getDefaultGameState("Cadet");

        Map<String, Integer> overrides = parseOverrides(user.getShipSystemsStateJson());
        int clamped = Math.max(0, Math.min(100, powerPercentage));
        overrides.put(systemKey, clamped);

        try {
            user.setShipSystemsStateJson(objectMapper.writeValueAsString(overrides));
            userRepository.save(user);
        } catch (Exception e) {
            // Log and continue
        }

        return getGameState(username);
    }

    private ShipSystemStatusDTO calculateSystemStatus(
            String systemKey,
            String displayName,
            String javaConcept,
            Long missionId,
            Map<Long, UserProgress> progressMap,
            Map<String, Integer> overrides,
            String description
    ) {
        int power = 0;
        if (overrides.containsKey(systemKey)) {
            power = overrides.get(systemKey);
        } else if (missionId != null && progressMap.containsKey(missionId)) {
            UserProgress up = progressMap.get(missionId);
            if (Boolean.TRUE.equals(up.getCompleted())) {
                power = 100;
            } else if (up.getAttempts() != null && up.getAttempts() > 0) {
                // In progress / practice phase
                power = 60;
            } else if (Boolean.TRUE.equals(up.getUnlocked())) {
                // Lesson phase
                power = 25;
            }
        }

        String status;
        String visualEffect;
        boolean lightsOn = false;
        boolean energyFlowing = false;
        boolean engineActive = false;

        if (power >= 100) {
            status = "ONLINE";
            visualEffect = "cyan-active-glow";
            lightsOn = true;
            energyFlowing = true;
            engineActive = true;
        } else if (power >= 60) {
            status = "PARTIALLY_ACTIVE";
            visualEffect = "amber-flicker";
            lightsOn = true;
            energyFlowing = true;
            engineActive = false;
        } else if (power > 0) {
            status = "DAMAGED";
            visualEffect = "pulsing-red";
            lightsOn = false;
            energyFlowing = false;
            engineActive = false;
        } else {
            status = "OFFLINE";
            visualEffect = "dim-gray";
            lightsOn = false;
            energyFlowing = false;
            engineActive = false;
        }

        return new ShipSystemStatusDTO(
                systemKey,
                displayName,
                javaConcept,
                power,
                status,
                description,
                visualEffect,
                lightsOn,
                energyFlowing,
                engineActive
        );
    }

    private Map<String, Integer> parseOverrides(String json) {
        if (json == null || json.isBlank()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private GameStateDTO getDefaultGameState(String name) {
        return new GameStateDTO(
                name,
                1,
                0,
                "USS Vanguard",
                Collections.emptyList(),
                Collections.emptyMap()
        );
    }
}
