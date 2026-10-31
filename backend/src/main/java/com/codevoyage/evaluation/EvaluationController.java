package com.codevoyage.evaluation;

import com.codevoyage.evaluation.dto.*;
import com.codevoyage.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping({"/api/evaluation", "/api/v1/evaluation"})
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    /**
     * Get assessment questions for PRE_TEST or POST_TEST.
     * Answers are NEVER exposed in this endpoint.
     */
    @GetMapping("/questions")
    public ResponseEntity<List<EvaluationQuestionDTO>> getQuestions(
            @RequestParam(name = "type", defaultValue = "PRE_TEST") String type
    ) {
        return ResponseEntity.ok(evaluationService.getQuestions(type));
    }

    /**
     * Submit an evaluation attempt (PRE_TEST or POST_TEST).
     * Server grades and records attempt without permitting repeated attempt overwrites.
     */
    @PostMapping("/submit")
    public ResponseEntity<EvaluationComparisonDTO> submitEvaluation(
            @RequestBody EvaluationSubmissionRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }
        return ResponseEntity.ok(evaluationService.submitEvaluation(authentication.getName(), request));
    }

    /**
     * Get student's evaluation comparison (Pre-test vs Post-test vs Improvement).
     */
    @GetMapping("/comparison")
    public ResponseEntity<EvaluationComparisonDTO> getComparison(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated cadet found");
        }
        return ResponseEntity.ok(evaluationService.getComparison(authentication.getName()));
    }

    /**
     * Exportable learning evaluation dataset in JSON format for project analysis.
     */
    @GetMapping("/dataset")
    public ResponseEntity<List<EvaluationDatasetRecordDTO>> getEvaluationDataset() {
        return ResponseEntity.ok(evaluationService.getExportableDataset());
    }

    /**
     * Exportable learning evaluation dataset in CSV format for direct empirical analysis in Excel / Python / R.
     */
    @GetMapping(value = "/dataset/csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportDatasetCsv() {
        List<EvaluationDatasetRecordDTO> records = evaluationService.getExportableDataset();

        StringBuilder csv = new StringBuilder();
        csv.append("UserId,Username,UserLevel,TotalXP,MissionsCompleted,")
           .append("PreTestCompleted,PreTestScore,PreTestPercentage,PreTestTimeSec,")
           .append("PostTestCompleted,PostTestScore,PostTestPercentage,PostTestTimeSec,")
           .append("RawScoreGain,PercentageGain,NormalizedGainClassification,")
           .append("SyntaxGain,VariablesGain,DataTypesGain,InputGain,OperatorsGain,ConditionsGain\n");

        for (EvaluationDatasetRecordDTO r : records) {
            csv.append(r.getUserId()).append(",")
               .append(escapeCsv(r.getUsername())).append(",")
               .append(r.getUserLevel() != null ? r.getUserLevel() : 1).append(",")
               .append(r.getTotalXp() != null ? r.getTotalXp() : 0).append(",")
               .append(r.getMissionsCompleted() != null ? r.getMissionsCompleted() : 0).append(",")
               .append(Boolean.TRUE.equals(r.getPreTestCompleted())).append(",")
               .append(r.getPreTestScore() != null ? r.getPreTestScore() : "").append(",")
               .append(r.getPreTestPercentage() != null ? r.getPreTestPercentage() : "").append(",")
               .append(r.getPreTestTimeSeconds() != null ? r.getPreTestTimeSeconds() : "").append(",")
               .append(Boolean.TRUE.equals(r.getPostTestCompleted())).append(",")
               .append(r.getPostTestScore() != null ? r.getPostTestScore() : "").append(",")
               .append(r.getPostTestPercentage() != null ? r.getPostTestPercentage() : "").append(",")
               .append(r.getPostTestTimeSeconds() != null ? r.getPostTestTimeSeconds() : "").append(",")
               .append(r.getRawScoreGain() != null ? r.getRawScoreGain() : "").append(",")
               .append(r.getPercentageGain() != null ? r.getPercentageGain() : "").append(",")
               .append(escapeCsv(r.getNormalizedLearningGain() != null ? r.getNormalizedLearningGain() : "")).append(",")
               .append(r.getSyntaxGain() != null ? r.getSyntaxGain() : "").append(",")
               .append(r.getVariablesGain() != null ? r.getVariablesGain() : "").append(",")
               .append(r.getDataTypesGain() != null ? r.getDataTypesGain() : "").append(",")
               .append(r.getInputGain() != null ? r.getInputGain() : "").append(",")
               .append(r.getOperatorsGain() != null ? r.getOperatorsGain() : "").append(",")
               .append(r.getConditionsGain() != null ? r.getConditionsGain() : "")
               .append("\n");
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"codevoyage_learning_evaluation_dataset.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
