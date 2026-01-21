package com.flowstate.api.dto;

import java.util.List;

public class HabitHeatmapDTO {
    private Integer year;                 // 年份
    private List<DayValue> data;         // 每天的数据点

    public HabitHeatmapDTO() {
    }

    public HabitHeatmapDTO(Integer year, List<DayValue> data) {
        this.year = year;
        this.data = data;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public List<DayValue> getData() {
        return data;
    }

    public void setData(List<DayValue> data) {
        this.data = data;
    }

    public static class DayValue {
        private String date;              // 日期（YYYY-MM-DD）
        private Integer count;            // 完成的习惯数
        private Double completion;        // 完成率（0-100）

        public DayValue() {
        }

        public DayValue(String date, Integer count, Double completion) {
            this.date = date;
            this.count = count;
            this.completion = completion;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }

        public Double getCompletion() {
            return completion;
        }

        public void setCompletion(Double completion) {
            this.completion = completion;
        }
    }
}
