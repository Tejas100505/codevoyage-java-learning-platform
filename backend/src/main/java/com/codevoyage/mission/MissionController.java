package com.codevoyage.mission;

import com.codevoyage.mission.dto.MissionDetailDTO;
import com.codevoyage.world.dto.WorldDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/missions")
public class MissionController {

    private final MissionService missionService;
    private final com.codevoyage.progress.ProgressService progressService;
    private final com.codevoyage.user.UserRepository userRepository;

    public MissionController(
            MissionService missionService,
            com.codevoyage.progress.ProgressService progressService,
            com.codevoyage.user.UserRepository userRepository
    ) {
        this.missionService = missionService;
        this.progressService = progressService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{missionId}/hints/{hintId}")
    public ResponseEntity<Void> unlockHint(
            @PathVariable Long missionId,
            @PathVariable Long hintId,
            Authentication authentication
    ) {
        if (authentication != null) {
            userRepository.findByUsername(authentication.getName()).ifPresent(user -> {
                progressService.recordHintUsed(user.getId(), missionId);
            });
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/worlds")
    public ResponseEntity<List<WorldDTO>> getAllWorlds(Authentication authentication) {
        String username = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(missionService.getAllWorldsWithProgress(username));
    }

    @GetMapping("/{missionId}")
    public ResponseEntity<MissionDetailDTO> getMissionDetails(
            @PathVariable Long missionId,
            Authentication authentication
    ) {
        String username = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(missionService.getMissionDetails(missionId, username));
    }
}
