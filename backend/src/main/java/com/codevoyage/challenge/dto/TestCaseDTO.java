package com.codevoyage.challenge.dto;

public class TestCaseDTO {
    private Long id;
    private String input;
    private String expectedOutput;
    private String description;

    public TestCaseDTO() {}

    public TestCaseDTO(Long id, String input, String expectedOutput, String description) {
        this.id = id;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
