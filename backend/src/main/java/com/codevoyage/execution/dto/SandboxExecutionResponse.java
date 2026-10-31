package com.codevoyage.execution.dto;

public class SandboxExecutionResponse {
    private boolean success;
    private String status; // SUCCESS, COMPILE_ERROR, RUNTIME_ERROR, TIMEOUT
    private String stdout = "";
    private String stderr = "";
    private Long executionTimeMs = 0L;

    public SandboxExecutionResponse() {}

    public SandboxExecutionResponse(boolean success, String status, String stdout, String stderr, Long executionTimeMs) {
        this.success = success;
        this.status = status;
        this.stdout = stdout != null ? stdout : "";
        this.stderr = stderr != null ? stderr : "";
        this.executionTimeMs = executionTimeMs != null ? executionTimeMs : 0L;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStdout() { return stdout; }
    public void setStdout(String stdout) { this.stdout = stdout; }

    public String getStderr() { return stderr; }
    public void setStderr(String stderr) { this.stderr = stderr; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
