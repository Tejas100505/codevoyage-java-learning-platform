package com.codevoyage.challenge.dto;

import java.util.List;

public class CodingChallengeDTO {
    private Long id;
    private String title;
    private String instructions;
    private String starterCode;
    private String methodSignature;
    private List<TestCaseDTO> visibleTestCases; // STRICT SECURITY: ONLY VISIBLE TESTS
    private List<HintDTO> hints;

    public CodingChallengeDTO() {}

    public CodingChallengeDTO(Long id, String title, String instructions, String starterCode, String methodSignature, List<TestCaseDTO> visibleTestCases, List<HintDTO> hints) {
        this.id = id;
        this.title = title;
        this.instructions = instructions;
        this.starterCode = starterCode;
        this.methodSignature = methodSignature;
        this.visibleTestCases = visibleTestCases;
        this.hints = hints;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }

    public String getMethodSignature() { return methodSignature; }
    public void setMethodSignature(String methodSignature) { this.methodSignature = methodSignature; }

    public List<TestCaseDTO> getVisibleTestCases() { return visibleTestCases; }
    public void setVisibleTestCases(List<TestCaseDTO> visibleTestCases) { this.visibleTestCases = visibleTestCases; }

    public List<HintDTO> getHints() { return hints; }
    public void setHints(List<HintDTO> hints) { this.hints = hints; }
}
