package com.codevoyage.analytics.dto;

public class PerformanceTrendPointDTO {
    private String date; // YYYY-MM-DD
    private int totalSubmissions;
    private int successfulSubmissions;
    private double codingSuccessRate;       // % of submissions that passed all test cases
    private double compilationSuccessRate;  // % of submissions that compiled without syntax errors
    private int cumulativeMissionsCleared;
    private double activeConceptMasteryAverage;

    public PerformanceTrendPointDTO() {}

    public PerformanceTrendPointDTO(
            String date,
            int totalSubmissions,
            int successfulSubmissions,
            double codingSuccessRate,
            double compilationSuccessRate,
            int cumulativeMissionsCleared,
            double activeConceptMasteryAverage
    ) {
        this.date = date;
        this.totalSubmissions = totalSubmissions;
        this.successfulSubmissions = successfulSubmissions;
        this.codingSuccessRate = codingSuccessRate;
        this.compilationSuccessRate = compilationSuccessRate;
        this.cumulativeMissionsCleared = cumulativeMissionsCleared;
        this.activeConceptMasteryAverage = activeConceptMasteryAverage;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(int totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public int getSuccessfulSubmissions() { return successfulSubmissions; }
    public void setSuccessfulSubmissions(int successfulSubmissions) { this.successfulSubmissions = successfulSubmissions; }

    public double getCodingSuccessRate() { return codingSuccessRate; }
    public void setCodingSuccessRate(double codingSuccessRate) { this.codingSuccessRate = codingSuccessRate; }

    public double getCompilationSuccessRate() { return compilationSuccessRate; }
    public void setCompilationSuccessRate(double compilationSuccessRate) { this.compilationSuccessRate = compilationSuccessRate; }

    public int getCumulativeMissionsCleared() { return cumulativeMissionsCleared; }
    public void setCumulativeMissionsCleared(int cumulativeMissionsCleared) { this.cumulativeMissionsCleared = cumulativeMissionsCleared; }

    public double getActiveConceptMasteryAverage() { return activeConceptMasteryAverage; }
    public void setActiveConceptMasteryAverage(double activeConceptMasteryAverage) { this.activeConceptMasteryAverage = activeConceptMasteryAverage; }
}

