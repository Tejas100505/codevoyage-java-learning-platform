package com.codevoyage.analytics.dto;

import java.util.List;

public class ConceptMasteryDTO {
    private String conceptKey;         // java-basics, variables, data-types, input, operators, conditions, loops, methods, arrays, oop
    private String conceptName;        // Java Basics, Variables, Data Types, Input, Operators, Conditions, Loops, Methods, Arrays, OOP
    private String category;           // Foundation, Control Flow, Data Structures, Architecture, etc.
    private int masteryPercentage;     // 0 - 100 based on verified evidence
    private String status;             // MASTERED (>=85%), PROFICIENT (>=60%), NEEDS_PRACTICE (<60% & attempted), LOCKED / AVAILABLE
    private String evidenceStatus;     // NOT_ATTEMPTED, INSUFFICIENT_EVIDENCE, DEVELOPING, DEMONSTRATED_PROFICIENCY
    private String formulaBreakdown;   // Transparent explanation of point allocation
    private boolean lessonCompleted;
    private boolean practiceCompleted;
    private boolean challengeCompleted;
    private boolean firstAttemptSuccess;
    private int practiceAccuracy;      // 0 - 100
    private int codingAttempts;
    private int testsPassed;
    private int totalTests;
    private int hintsUsed;
    private List<String> evidencePoints;
    private List<String> commonErrors;

    public ConceptMasteryDTO() {}

    public ConceptMasteryDTO(
            String conceptKey,
            String conceptName,
            String category,
            int masteryPercentage,
            String status,
            boolean lessonCompleted,
            boolean practiceCompleted,
            boolean challengeCompleted,
            int practiceAccuracy,
            int codingAttempts,
            int testsPassed,
            int totalTests,
            int hintsUsed,
            List<String> evidencePoints,
            List<String> commonErrors
    ) {
        this.conceptKey = conceptKey;
        this.conceptName = conceptName;
        this.category = category;
        this.masteryPercentage = masteryPercentage;
        this.status = status;
        this.lessonCompleted = lessonCompleted;
        this.practiceCompleted = practiceCompleted;
        this.challengeCompleted = challengeCompleted;
        this.practiceAccuracy = practiceAccuracy;
        this.codingAttempts = codingAttempts;
        this.testsPassed = testsPassed;
        this.totalTests = totalTests;
        this.hintsUsed = hintsUsed;
        this.evidencePoints = evidencePoints;
        this.commonErrors = commonErrors;
        
        // Derive evidenceStatus
        if (codingAttempts == 0 && !lessonCompleted && !practiceCompleted) {
            this.evidenceStatus = "NOT_ATTEMPTED";
        } else if (codingAttempts <= 1 && !challengeCompleted) {
            this.evidenceStatus = "INSUFFICIENT_EVIDENCE";
        } else if (masteryPercentage >= 85 && challengeCompleted) {
            this.evidenceStatus = "DEMONSTRATED_PROFICIENCY";
        } else {
            this.evidenceStatus = "DEVELOPING";
        }
        
        this.firstAttemptSuccess = challengeCompleted && codingAttempts <= 1;
        this.formulaBreakdown = String.format(
            "Lesson: %d/20 pts • Practice: %d/30 pts • Test Pass: %d/40 pts • Efficiency: %d/10 pts",
            lessonCompleted ? 20 : 0,
            practiceCompleted ? 30 : 0,
            challengeCompleted ? 40 : Math.min(15, codingAttempts * 5),
            (challengeCompleted && codingAttempts <= 2 && hintsUsed == 0) ? 10 : (challengeCompleted && codingAttempts <= 3 && hintsUsed <= 1) ? 5 : 0
        );
    }

    public String getConceptKey() { return conceptKey; }
    public void setConceptKey(String conceptKey) { this.conceptKey = conceptKey; }

    public String getConceptName() { return conceptName; }
    public void setConceptName(String conceptName) { this.conceptName = conceptName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getMasteryPercentage() { return masteryPercentage; }
    public void setMasteryPercentage(int masteryPercentage) { this.masteryPercentage = masteryPercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEvidenceStatus() { return evidenceStatus; }
    public void setEvidenceStatus(String evidenceStatus) { this.evidenceStatus = evidenceStatus; }

    public String getFormulaBreakdown() { return formulaBreakdown; }
    public void setFormulaBreakdown(String formulaBreakdown) { this.formulaBreakdown = formulaBreakdown; }

    public boolean isLessonCompleted() { return lessonCompleted; }
    public void setLessonCompleted(boolean lessonCompleted) { this.lessonCompleted = lessonCompleted; }

    public boolean isPracticeCompleted() { return practiceCompleted; }
    public void setPracticeCompleted(boolean practiceCompleted) { this.practiceCompleted = practiceCompleted; }

    public boolean isChallengeCompleted() { return challengeCompleted; }
    public void setChallengeCompleted(boolean challengeCompleted) { this.challengeCompleted = challengeCompleted; }

    public boolean isFirstAttemptSuccess() { return firstAttemptSuccess; }
    public void setFirstAttemptSuccess(boolean firstAttemptSuccess) { this.firstAttemptSuccess = firstAttemptSuccess; }

    public int getPracticeAccuracy() { return practiceAccuracy; }
    public void setPracticeAccuracy(int practiceAccuracy) { this.practiceAccuracy = practiceAccuracy; }

    public int getCodingAttempts() { return codingAttempts; }
    public void setCodingAttempts(int codingAttempts) { this.codingAttempts = codingAttempts; }

    public int getTestsPassed() { return testsPassed; }
    public void setTestsPassed(int testsPassed) { this.testsPassed = testsPassed; }

    public int getTotalTests() { return totalTests; }
    public void setTotalTests(int totalTests) { this.totalTests = totalTests; }

    public int getHintsUsed() { return hintsUsed; }
    public void setHintsUsed(int hintsUsed) { this.hintsUsed = hintsUsed; }

    public List<String> getEvidencePoints() { return evidencePoints; }
    public void setEvidencePoints(List<String> evidencePoints) { this.evidencePoints = evidencePoints; }

    public List<String> getCommonErrors() { return commonErrors; }
    public void setCommonErrors(List<String> commonErrors) { this.commonErrors = commonErrors; }
}
