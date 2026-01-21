package com.flowstate.api.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class TimeAllocationDTO {
    private String totalFocus;           // 总专注时长（格式化，如 "142h"）
    private String comparison;           // 环比增长（如 "比上周 +12%"）
    private List<CategoryTime> categories; // 各分类的时间统计
    private List<DailyTime> dailyData;   // 每日时间数据（用于折线图/柱状图）

    public TimeAllocationDTO() {
    }

    public TimeAllocationDTO(String totalFocus, String comparison, List<CategoryTime> categories, List<DailyTime> dailyData) {
        this.totalFocus = totalFocus;
        this.comparison = comparison;
        this.categories = categories;
        this.dailyData = dailyData;
    }

    public String getTotalFocus() {
        return totalFocus;
    }

    public void setTotalFocus(String totalFocus) {
        this.totalFocus = totalFocus;
    }

    public String getComparison() {
        return comparison;
    }

    public void setComparison(String comparison) {
        this.comparison = comparison;
    }

    public List<CategoryTime> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryTime> categories) {
        this.categories = categories;
    }

    public List<DailyTime> getDailyData() {
        return dailyData;
    }

    public void setDailyData(List<DailyTime> dailyData) {
        this.dailyData = dailyData;
    }

    public static class CategoryTime {
        private String category;         // 分类名称
        private String displayName;      // 显示名称（如"深度工作"）
        private Long minutes;            // 分钟数
        private String formatted;        // 格式化时长（如 "64h"）
        private Double percentage;       // 占比（如 45.2）

        public CategoryTime() {
        }

        public CategoryTime(String category, String displayName, Long minutes, String formatted, Double percentage) {
            this.category = category;
            this.displayName = displayName;
            this.minutes = minutes;
            this.formatted = formatted;
            this.percentage = percentage;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public Long getMinutes() {
            return minutes;
        }

        public void setMinutes(Long minutes) {
            this.minutes = minutes;
        }

        public String getFormatted() {
            return formatted;
        }

        public void setFormatted(String formatted) {
            this.formatted = formatted;
        }

        public Double getPercentage() {
            return percentage;
        }

        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }
    }

    public static class DailyTime {
        private LocalDate date;          // 日期
        private Map<String, Long> categoryMinutes; // 各分类时长
        private Long totalMinutes;       // 当日总时长

        public DailyTime() {
        }

        public DailyTime(LocalDate date, Map<String, Long> categoryMinutes, Long totalMinutes) {
            this.date = date;
            this.categoryMinutes = categoryMinutes;
            this.totalMinutes = totalMinutes;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public Map<String, Long> getCategoryMinutes() {
            return categoryMinutes;
        }

        public void setCategoryMinutes(Map<String, Long> categoryMinutes) {
            this.categoryMinutes = categoryMinutes;
        }

        public Long getTotalMinutes() {
            return totalMinutes;
        }

        public void setTotalMinutes(Long totalMinutes) {
            this.totalMinutes = totalMinutes;
        }
    }
}
