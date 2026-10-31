package com.codevoyage.analytics;

import com.codevoyage.analytics.dto.*;
import com.codevoyage.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/analytics", "/api/v1/analytics"})
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Phase 2: Learning analytics overview for authenticated cadet.
     * Security: Authenticated session only. Does NOT expose sensitive analytics to other users.
     */
    @GetMapping("/me")
    public ResponseEntity<UserAnalyticsDTO> getMyAnalytics(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        String username = authentication.getName();
        UserAnalyticsDTO analytics = analyticsService.getUserAnalytics(username);
        return ResponseEntity.ok(analytics);
    }

    /**
     * Phase 3: Historical performance trends from real persisted records.
     * @param range "7d", "30d", or "all"
     */
    @GetMapping("/trends")
    public ResponseEntity<PerformanceTrendsResponseDTO> getPerformanceTrends(
            @RequestParam(name = "range", required = false, defaultValue = "7d") String range,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        String username = authentication.getName();
        PerformanceTrendsResponseDTO trends = analyticsService.getPerformanceTrends(username, range);
        return ResponseEntity.ok(trends);
    }

    /**
     * Phase 5: Coding error diagnostics & failure breakdown.
     */
    @GetMapping("/errors")
    public ResponseEntity<CodingErrorAnalyticsDTO> getCodingErrorAnalytics(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        String username = authentication.getName();
        CodingErrorAnalyticsDTO errors = analyticsService.getCodingErrorAnalytics(username);
        return ResponseEntity.ok(errors);
    }

    /**
     * Phase 6: Deterministic rule-based personalized curriculum recommendations.
     */
    @GetMapping("/recommendations")
    public ResponseEntity<List<LearningRecommendationDTO>> getPersonalizedRecommendations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        String username = authentication.getName();
        List<LearningRecommendationDTO> recommendations = analyticsService.getPersonalizedRecommendations(username);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Phase 7: Role-protected faculty / commander class-wide analytics.
     * Enforces COMMANDER or ADMIN role.
     */
    @GetMapping("/faculty")
    public ResponseEntity<FacultyAnalyticsDTO> getFacultyAnalytics(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }

        String username = authentication.getName();
        FacultyAnalyticsDTO facultyAnalytics = analyticsService.getFacultyAnalytics(username);
        return ResponseEntity.ok(facultyAnalytics);
    }
}

