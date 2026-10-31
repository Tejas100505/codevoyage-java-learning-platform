package com.codevoyage.analytics.dto;

import java.util.List;

public class PerformanceTrendsResponseDTO {
    private String range; // "7d", "30d", "all"
    private List<PerformanceTrendPointDTO> trendPoints;
    private int totalSubmissionsInPeriod;
    private double successRateInPeriod;
    private double compilationRateInPeriod;
    private boolean hasActivity;

    public PerformanceTrendsResponseDTO() {}

    public PerformanceTrendsResponseDTO(
            String range,
            List<PerformanceTrendPointDTO> trendPoints,
            int totalSubmissionsInPeriod,
            double successRateInPeriod,
            double compilationRateInPeriod,
            boolean hasActivity
    ) {
        this.range = range;
        this.trendPoints = trendPoints;
        this.totalSubmissionsInPeriod = totalSubmissionsInPeriod;
        this.successRateInPeriod = successRateInPeriod;
        this.compilationRateInPeriod = compilationRateInPeriod;
        this.hasActivity = hasActivity;
    }

    public String getRange() { return range; }
    public void setRange(String range) { this.range = range; }

    public List<PerformanceTrendPointDTO> getTrendPoints() { return trendPoints; }
    public void setTrendPoints(List<PerformanceTrendPointDTO> trendPoints) { this.trendPoints = trendPoints; }

    public int getTotalSubmissionsInPeriod() { return totalSubmissionsInPeriod; }
    public void setTotalSubmissionsInPeriod(int totalSubmissionsInPeriod) { this.totalSubmissionsInPeriod = totalSubmissionsInPeriod; }

    public double getSuccessRateInPeriod() { return successRateInPeriod; }
    public void setSuccessRateInPeriod(double successRateInPeriod) { this.successRateInPeriod = successRateInPeriod; }

    public double getCompilationRateInPeriod() { return compilationRateInPeriod; }
    public void setCompilationRateInPeriod(double compilationRateInPeriod) { this.compilationRateInPeriod = compilationRateInPeriod; }

    public boolean isHasActivity() { return hasActivity; }
    public void setHasActivity(boolean hasActivity) { this.hasActivity = hasActivity; }
}

