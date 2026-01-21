package com.flowstate.api.dto;

import java.time.LocalDate;
import java.util.List;

public class HabitConsistencyDTO {
    private Double averageCompletionRate; // 平均完成率
    private List<DayData> dailyData;      // 每日数据点

    public HabitConsistencyDTO() {
    }

    public HabitConsistencyDTO(Double averageCompletionRate, List<DayData> dailyData) {
        this.averageCompletionRate = averageCompletionRate;
        this.dailyData = dailyData;
    }

    public Double getAverageCompletionRate() {
        return averageCompletionRate;
    }

    public void setAverageCompletionRate(Double averageCompletionRate) {
        this.averageCompletionRate = averageCompletionRate;
    }

    public List<DayData> getDailyData() {
        return dailyData;
    }

    public void setDailyData(List<DayData> dailyData) {
        this.dailyData = dailyData;
    }

    public static class DayData {
        private LocalDate date;           // 日期
        private String label;             // 日期标签（如 "一"、"02-15"）
        private Double completionRate;    // 当日完成率（0-100）
        private Integer totalHabits;      // 总习惯数
        private Integer completedHabits;  // 完成习惯数

        public DayData() {
        }

        public DayData(LocalDate date, String label, Double completionRate, Integer totalHabits, Integer completedHabits) {
            this.date = date;
            this.label = label;
            this.completionRate = completionRate;
            this.totalHabits = totalHabits;
            this.completedHabits = completedHabits;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(Double completionRate) {
            this.completionRate = completionRate;
        }

        public Integer getTotalHabits() {
            return totalHabits;
        }

        public void setTotalHabits(Integer totalHabits) {
            this.totalHabits = totalHabits;
        }

        public Integer getCompletedHabits() {
            return completedHabits;
        }

        public void setCompletedHabits(Integer completedHabits) {
            this.completedHabits = completedHabits;
        }
    }
}
