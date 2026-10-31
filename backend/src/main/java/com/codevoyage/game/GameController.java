package com.codevoyage.game;

import com.codevoyage.game.dto.GameStateDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/game")
public class GameController {

    private final GameStateService gameStateService;

    public GameController(GameStateService gameStateService) {
        this.gameStateService = gameStateService;
    }

    @GetMapping("/state")
    public ResponseEntity<GameStateDTO> getGameState(Authentication authentication) {
        String username = (authentication != null) ? authentication.getName() : "Cadet";
        return ResponseEntity.ok(gameStateService.getGameState(username));
    }

    @PostMapping("/state/systems/{systemKey}")
    public ResponseEntity<GameStateDTO> updateSystemState(
            @PathVariable String systemKey,
            @RequestBody Map<String, Integer> payload,
            Authentication authentication
    ) {
        String username = (authentication != null) ? authentication.getName() : "Cadet";
        int power = payload.getOrDefault("powerPercentage", 100);
        return ResponseEntity.ok(gameStateService.updateSystemState(username, systemKey, power));
    }

    @GetMapping("/sectors")
    public ResponseEntity<List<Map<String, Object>>> getSectors() {
        // Initial foundational sectors mapping the Java Journey
        List<Map<String, Object>> sectors = List.of(
                Map.of(
                        "id", 1,
                        "name", "Sector 01: Nova Prime",
                        "lore", "The starting outpost where cadets calibrate ship cores using Java variables, types, and math operators.",
                        "topic", "Variables, Data Types & Operators",
                        "unlocked", true,
                        "totalLevels", 5
                ),
                Map.of(
                        "id", 2,
                        "name", "Sector 02: Asteroid Belt of Decisions",
                        "lore", "Navigate through asteroid fields and route reactor power using conditional branching and logic gates.",
                        "topic", "If/Else Statements & Switch Expressions",
                        "unlocked", false,
                        "totalLevels", 5
                ),
                Map.of(
                        "id", 3,
                        "name", "Sector 03: The Pulsar Loop",
                        "lore", "Harness cyclical stellar energy surges by mastering iteration and looping structures.",
                        "topic", "Loops (for, while, do-while)",
                        "unlocked", false,
                        "totalLevels", 6
                ),
                Map.of(
                        "id", 4,
                        "name", "Sector 04: Nebula Matrix",
                        "lore", "Organize sensor telemetry grids and scanner buffers with Java arrays and collections.",
                        "topic", "Arrays & Memory Structures",
                        "unlocked", false,
                        "totalLevels", 6
                ),
                Map.of(
                        "id", 5,
                        "name", "Sector 05: Orbital Modules",
                        "lore", "Assemble starship components into encapsulated, modular classes and construct OOP fleets.",
                        "topic", "Object-Oriented Programming (Classes & Objects)",
                        "unlocked", false,
                        "totalLevels", 8
                )
        );
        return ResponseEntity.ok(sectors);
    }
}

