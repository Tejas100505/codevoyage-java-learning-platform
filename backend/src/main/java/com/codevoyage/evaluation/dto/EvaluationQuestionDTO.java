package com.codevoyage.evaluation.dto;

import java.util.List;

public class EvaluationQuestionDTO {
    private String id;
    private String concept;          // BASIC_SYNTAX, VARIABLES, DATA_TYPES, INPUT, OPERATORS, CONDITIONS
    private String conceptLabel;     // Basic Syntax, Variables, Data Types, Input, Operators, Conditions
    private String prompt;
    private String codeSnippet;
    private List<String> options;

    public EvaluationQuestionDTO() {}

    public EvaluationQuestionDTO(String id, String concept, String conceptLabel, String prompt, String codeSnippet, List<String> options) {
        this.id = id;
        this.concept = concept;
        this.conceptLabel = conceptLabel;
        this.prompt = prompt;
        this.codeSnippet = codeSnippet;
        this.options = options;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConcept() { return concept; }
    public void setConcept(String concept) { this.concept = concept; }

    public String getConceptLabel() { return conceptLabel; }
    public void setConceptLabel(String conceptLabel) { this.conceptLabel = conceptLabel; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
}
