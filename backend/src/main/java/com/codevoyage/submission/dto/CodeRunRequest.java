package com.codevoyage.submission.dto;

import jakarta.validation.constraints.NotBlank;

public class CodeRunRequest {

    @NotBlank(message = "Java source code cannot be empty")
    private String sourceCode;

    public CodeRunRequest() {}

    public CodeRunRequest(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
}
