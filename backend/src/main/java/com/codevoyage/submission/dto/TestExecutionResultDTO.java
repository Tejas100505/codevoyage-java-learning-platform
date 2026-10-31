package com.codevoyage.submission.dto;

public class TestExecutionResultDTO {
    private Long testId;
    private String description;
    private String input; // null if hidden
    private String expectedOutput; // null if hidden
    private String actualOutput; // null if hidden
    private boolean passed;
    private boolean hidden;

    public TestExecutionResultDTO() {}

    public TestExecutionResultDTO(Long testId, String description, String input, String expectedOutput, String actualOutput, boolean passed, boolean hidden) {
        this.testId = testId;
        this.description = description;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.actualOutput = actualOutput;
        this.passed = passed;
        this.hidden = hidden;
    }

    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }
}
