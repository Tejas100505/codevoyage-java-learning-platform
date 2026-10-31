package com.codevoyage.submission;

import com.codevoyage.submission.dto.CodeRunRequest;
import com.codevoyage.submission.dto.SubmissionResultDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    /**
     * Run code against visible test cases (supports /api/missions/{id}/run and /api/levels/{id}/run)
     */
    @PostMapping({
            "/api/missions/{id}/run",
            "/api/v1/missions/{id}/run",
            "/api/levels/{id}/run",
            "/api/v1/levels/{id}/run"
    })
    public ResponseEntity<SubmissionResultDTO> runCode(
            @PathVariable("id") Long missionId,
            @Valid @RequestBody CodeRunRequest request,
            Authentication authentication
    ) {
        String username = (authentication != null) ? authentication.getName() : null;
        SubmissionResultDTO result = submissionService.runCode(missionId, request.getSourceCode(), username);
        return ResponseEntity.ok(result);
    }

    /**
     * Submit code against visible and hidden test cases with server-side grading & rewards
     */
    @PostMapping({
            "/api/missions/{id}/submit",
            "/api/v1/missions/{id}/submit",
            "/api/levels/{id}/submit",
            "/api/v1/levels/{id}/submit"
    })
    public ResponseEntity<SubmissionResultDTO> submitCode(
            @PathVariable("id") Long missionId,
            @Valid @RequestBody CodeRunRequest request,
            Authentication authentication
    ) {
        String username = (authentication != null) ? authentication.getName() : null;
        SubmissionResultDTO result = submissionService.submitCode(missionId, request.getSourceCode(), username);
        return ResponseEntity.ok(result);
    }
}
