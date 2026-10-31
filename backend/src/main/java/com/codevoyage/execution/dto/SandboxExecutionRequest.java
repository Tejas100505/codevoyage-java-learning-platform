package com.codevoyage.execution.dto;

public class SandboxExecutionRequest {
    private String code;
    private String className = "Solution";
    private String stdin = "";
    private Integer timeoutMs = 5000;

    public SandboxExecutionRequest() {}

    public SandboxExecutionRequest(String code, String className, String stdin, Integer timeoutMs) {
        this.code = code;
        this.className = (className != null && !className.isBlank()) ? className : "Solution";
        this.stdin = (stdin != null) ? stdin : "";
        this.timeoutMs = (timeoutMs != null && timeoutMs > 0) ? timeoutMs : 5000;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getStdin() { return stdin; }
    public void setStdin(String stdin) { this.stdin = stdin; }

    public Integer getTimeoutMs() { return timeoutMs; }
    public void setTimeoutMs(Integer timeoutMs) { this.timeoutMs = timeoutMs; }
}
