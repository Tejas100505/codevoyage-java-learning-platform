package com.codevoyage.progress;

import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.progress.dto.MissionCompleteRequest;
import com.codevoyage.progress.dto.UserProgressDTO;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController {

    private final ProgressService progressService;
    private final UserRepository userRepository;

    public ProgressController(ProgressService progressService, UserRepository userRepository) {
        this.progressService = progressService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserProgressDTO>> getUserProgress(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(progressService.getUserProgress(authentication.getName()));
    }

    @GetMapping("/skill-tree")
    public ResponseEntity<List<com.codevoyage.progress.dto.SkillTreeNodeDTO>> getSkillTree(Authentication authentication) {
        String username = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        return ResponseEntity.ok(progressService.getSkillTreeNodes(username));
    }

    @PostMapping("/missions/{missionId}/complete-lesson")
    public ResponseEntity<Map<String, Object>> completeLesson(
            @PathVariable Long missionId,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Cadet not found: " + authentication.getName()));

        int awardedXp = progressService.completeLesson(user.getId(), missionId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "missionId", missionId,
                "xpEarned", awardedXp,
                "alreadyCompleted", awardedXp == 0,
                "message", awardedXp > 0 ? "Lesson engagement registered. +" + awardedXp + " XP awarded." : "Lesson telemetry already verified."
        ));
    }

    @PostMapping("/missions/{missionId}/complete-practice")
    public ResponseEntity<Map<String, Object>> completePractice(
            @PathVariable Long missionId,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Cadet not found: " + authentication.getName()));

        int awardedXp = progressService.completePractice(user.getId(), missionId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "missionId", missionId,
                "xpEarned", awardedXp,
                "alreadyCompleted", awardedXp == 0,
                "message", awardedXp > 0 ? "Practice simulation cleared. +" + awardedXp + " XP awarded." : "Practice telemetry already verified."
        ));
    }

    @PostMapping("/missions/{missionId}/complete")
    public ResponseEntity<Map<String, Object>> completeMission(
            @PathVariable Long missionId,
            @RequestBody(required = false) MissionCompleteRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Cadet not found: " + authentication.getName()));

        int stars = request != null && request.getStars() > 0 ? request.getStars() : 3;
        int xp = request != null && request.getXpEarned() > 0 ? request.getXpEarned() : 100;
        long duration = request != null ? request.getDurationSeconds() : 60L;

        progressService.completeMission(user.getId(), missionId, stars, xp, duration);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "missionId", missionId,
                "starsEarned", stars,
                "xpEarned", xp,
                "message", "Mission telemetry verified. Next mission sequence unlocked."
        ));
    }
}
