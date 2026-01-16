package com.flowstate.api.dto;

public class FocusTodayStatsDTO {
    private Integer totalMinutes;
    private Integer completedSessions;

    public FocusTodayStatsDTO() {
    }

    public FocusTodayStatsDTO(Integer totalMinutes, Integer completedSessions) {
        this.totalMinutes = totalMinutes;
        this.completedSessions = completedSessions;
    }

    public Integer getTotalMinutes() {
        return totalMinutes;
    }

    public void setTotalMinutes(Integer totalMinutes) {
        this.totalMinutes = totalMinutes;
    }

    public Integer getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(Integer completedSessions) {
        this.completedSessions = completedSessions;
    }
}
