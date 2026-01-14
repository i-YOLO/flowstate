package com.flowstate.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TimeRecordResponse {
    private UUID id;
    private String title;
    private String subtitle;
    private Integer startTime;
    private Integer duration;
    private String category;
    private String color;
    private UUID habitId;
    private LocalDateTime createdAt;

    public TimeRecordResponse() {
    }

    public TimeRecordResponse(UUID id, String title, String subtitle, Integer startTime, Integer duration,
            String category, String color, UUID habitId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.startTime = startTime;
        this.duration = duration;
        this.category = category;
        this.color = color;
        this.habitId = habitId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Integer getStartTime() {
        return startTime;
    }

    public void setStartTime(Integer startTime) {
        this.startTime = startTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public UUID getHabitId() {
        return habitId;
    }

    public void setHabitId(UUID habitId) {
        this.habitId = habitId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private TimeRecordResponse response = new TimeRecordResponse();

        public Builder id(UUID id) {
            response.setId(id);
            return this;
        }

        public Builder title(String title) {
            response.setTitle(title);
            return this;
        }

        public Builder subtitle(String subtitle) {
            response.setSubtitle(subtitle);
            return this;
        }

        public Builder startTime(Integer startTime) {
            response.setStartTime(startTime);
            return this;
        }

        public Builder duration(Integer duration) {
            response.setDuration(duration);
            return this;
        }

        public Builder category(String category) {
            response.setCategory(category);
            return this;
        }

        public Builder color(String color) {
            response.setColor(color);
            return this;
        }

        public Builder habitId(UUID habitId) {
            response.setHabitId(habitId);
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            response.setCreatedAt(createdAt);
            return this;
        }

        public TimeRecordResponse build() {
            return response;
        }
    }
}
