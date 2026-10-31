package com.codevoyage.achievement;

import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/achievements", "/api/v1/achievements"})
public class AchievementController {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;

    public AchievementController(
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            UserRepository userRepository
    ) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAchievements(Authentication authentication) {
        List<Achievement> allAchievements = achievementRepository.findAll();
        Set<Long> unlockedIds = new HashSet<>();
        Map<Long, LocalDateTime> unlockedAtMap = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            userRepository.findByUsername(authentication.getName()).ifPresent(user -> {
                List<UserAchievement> userAchievements = userAchievementRepository.findByUserId(user.getId());
                for (UserAchievement ua : userAchievements) {
                    unlockedIds.add(ua.getAchievement().getId());
                    unlockedAtMap.put(ua.getAchievement().getId(), ua.getUnlockedAt());
                }
            });
        }

        List<Map<String, Object>> response = allAchievements.stream()
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", a.getId());
                    map.put("code", a.getCode());
                    map.put("name", a.getTitle());
                    map.put("description", a.getDescription());
                    map.put("xpReward", a.getXpBonus());
                    map.put("icon", a.getIconName());
                    map.put("unlocked", unlockedIds.contains(a.getId()));
                    map.put("unlockedAt", unlockedAtMap.get(a.getId()));
                    return map;
                })
                .sorted((a, b) -> {
                    // Unlocked first, then id
                    boolean u1 = (boolean) a.get("unlocked");
                    boolean u2 = (boolean) b.get("unlocked");
                    if (u1 != u2) {
                        return u1 ? -1 : 1;
                    }
                    return Long.compare((Long) a.get("id"), (Long) b.get("id"));
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
