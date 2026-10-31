package com.codevoyage.submission.dto;

import java.util.ArrayList;
import java.util.List;

public class SubmissionResultDTO {
    private String status; // SUCCESS, COMPILE_ERROR, RUNTIME_ERROR, TIMEOUT, WRONG_ANSWER
    private boolean success;
    private boolean completed;
    private String stdout = "";
    private String stderr = "";
    private Long executionTimeMs = 0L;
    private Integer errorLine;
    private String diagnosticHint;
    private int totalTests = 0;
    private int passedTests = 0;
    private int starsEarned = 0;
    private int xpEarned = 0;
    private List<TestExecutionResultDTO> testCases = new ArrayList<>();

    // Authoritative planet / sector completion telemetry
    private boolean worldCompleted = false;
    private String completedWorldName;
    private Integer completedWorldOrder;
    private int totalMissionsInWorld = 0;
    private int completedMissionsInWorld = 0;
    private boolean nextWorldUnlocked = false;
    private Long nextWorldId;
    private String nextWorldName;
    private Integer nextWorldOrder;

    public SubmissionResultDTO() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getStdout() { return stdout; }
    public void setStdout(String stdout) { this.stdout = stdout; }

    public String getStderr() { return stderr; }
    public void setStderr(String stderr) { this.stderr = stderr; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Integer getErrorLine() { return errorLine; }
    public void setErrorLine(Integer errorLine) { this.errorLine = errorLine; }

    public String getDiagnosticHint() { return diagnosticHint; }
    public void setDiagnosticHint(String diagnosticHint) { this.diagnosticHint = diagnosticHint; }

    public int getTotalTests() { return totalTests; }
    public void setTotalTests(int totalTests) { this.totalTests = totalTests; }

    public int getPassedTests() { return passedTests; }
    public void setPassedTests(int passedTests) { this.passedTests = passedTests; }

    public int getStarsEarned() { return starsEarned; }
    public void setStarsEarned(int starsEarned) { this.starsEarned = starsEarned; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public List<TestExecutionResultDTO> getTestCases() { return testCases; }
    public void setTestCases(List<TestExecutionResultDTO> testCases) { this.testCases = testCases; }

    public boolean isWorldCompleted() { return worldCompleted; }
    public void setWorldCompleted(boolean worldCompleted) { this.worldCompleted = worldCompleted; }

    public String getCompletedWorldName() { return completedWorldName; }
    public void setCompletedWorldName(String completedWorldName) { this.completedWorldName = completedWorldName; }

    public Integer getCompletedWorldOrder() { return completedWorldOrder; }
    public void setCompletedWorldOrder(Integer completedWorldOrder) { this.completedWorldOrder = completedWorldOrder; }

    public int getTotalMissionsInWorld() { return totalMissionsInWorld; }
    public void setTotalMissionsInWorld(int totalMissionsInWorld) { this.totalMissionsInWorld = totalMissionsInWorld; }

    public int getCompletedMissionsInWorld() { return completedMissionsInWorld; }
    public void setCompletedMissionsInWorld(int completedMissionsInWorld) { this.completedMissionsInWorld = completedMissionsInWorld; }

    public boolean isNextWorldUnlocked() { return nextWorldUnlocked; }
    public void setNextWorldUnlocked(boolean nextWorldUnlocked) { this.nextWorldUnlocked = nextWorldUnlocked; }

    public Long getNextWorldId() { return nextWorldId; }
    public void setNextWorldId(Long nextWorldId) { this.nextWorldId = nextWorldId; }

    public String getNextWorldName() { return nextWorldName; }
    public void setNextWorldName(String nextWorldName) { this.nextWorldName = nextWorldName; }

    public Integer getNextWorldOrder() { return nextWorldOrder; }
    public void setNextWorldOrder(Integer nextWorldOrder) { this.nextWorldOrder = nextWorldOrder; }
}
