package com.flowstate.api.dto;

import java.time.LocalDate;

public class AchievementDTO {
    private String bestDay;              // 最佳表现日（如 "2026-01-15"）
    private LocalDate bestDate;          // 最佳日期
    private Double completionRate;       // 任务完成率（如 95.0）
    private String focusHours;           // 专注时长（如 "8.5"）
    private Integer productivityScore;   // 生产力指数（0-100）
    private String summary;              // 成就总结文本
    private Long streakDays;             // 专注连续天数
    private Integer completedTasks;      // 完成任务数
    private String taskGrowth;           // 任务增长（如 "+18%"）

    public AchievementDTO() {
    }

    public AchievementDTO(String bestDay, LocalDate bestDate, Double completionRate, String focusHours,
                          Integer productivityScore, String summary, Long streakDays, Integer completedTasks, String taskGrowth) {
        this.bestDay = bestDay;
        this.bestDate = bestDate;
        this.completionRate = completionRate;
        this.focusHours = focusHours;
        this.productivityScore = productivityScore;
        this.summary = summary;
        this.streakDays = streakDays;
        this.completedTasks = completedTasks;
        this.taskGrowth = taskGrowth;
    }

    public String getBestDay() {
        return bestDay;
    }

    public void setBestDay(String bestDay) {
        this.bestDay = bestDay;
    }

    public LocalDate getBestDate() {
        return bestDate;
    }

    public void setBestDate(LocalDate bestDate) {
        this.bestDate = bestDate;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public String getFocusHours() {
        return focusHours;
    }

    public void setFocusHours(String focusHours) {
        this.focusHours = focusHours;
    }

    public Integer getProductivityScore() {
        return productivityScore;
    }

    public void setProductivityScore(Integer productivityScore) {
        this.productivityScore = productivityScore;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Long getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Long streakDays) {
        this.streakDays = streakDays;
    }

    public Integer getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.completedTasks = completedTasks;
    }

    public String getTaskGrowth() {
        return taskGrowth;
    }

    public void setTaskGrowth(String taskGrowth) {
        this.taskGrowth = taskGrowth;
    }
}
