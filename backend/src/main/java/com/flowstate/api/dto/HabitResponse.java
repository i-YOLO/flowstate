package com.flowstate.api.dto;

import com.flowstate.api.enums.Frequency;
import com.flowstate.api.enums.GoalType;
import java.util.UUID;

public class HabitResponse {
    private UUID id;
    private String name;
    private String category;
    private GoalType goalType;
    private Frequency frequency;
    private Integer goalValue;
    private String unit;
    private String icon;
    private String color;
    private Integer currentValue;
    private Boolean isCompleted;
    private Integer currentStreak;
    private java.util.List<Boolean> lastSevenDays;

    public HabitResponse() {
    }

    public HabitResponse(UUID id, String name, String category, GoalType goalType, Frequency frequency, Integer goalValue, String unit,
            String icon, String color, Integer currentValue, Boolean isCompleted, Integer currentStreak, java.util.List<Boolean> lastSevenDays) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.goalType = goalType;
        this.frequency = frequency;
        this.goalValue = goalValue;
        this.unit = unit;
        this.icon = icon;
        this.color = color;
        this.currentValue = currentValue;
        this.isCompleted = isCompleted;
        this.currentStreak = currentStreak;
        this.lastSevenDays = lastSevenDays;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public GoalType getGoalType() {
        return goalType;
    }

    public void setGoalType(GoalType goalType) {
        this.goalType = goalType;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Integer getGoalValue() {
        return goalValue;
    }

    public void setGoalValue(Integer goalValue) {
        this.goalValue = goalValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Integer currentValue) {
        this.currentValue = currentValue;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public java.util.List<Boolean> getLastSevenDays() {
        return lastSevenDays;
    }

    public void setLastSevenDays(java.util.List<Boolean> lastSevenDays) {
        this.lastSevenDays = lastSevenDays;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private HabitResponse response = new HabitResponse();

        public Builder id(UUID id) {
            response.setId(id);
            return this;
        }

        public Builder name(String name) {
            response.setName(name);
            return this;
        }

        public Builder category(String category) {
            response.setCategory(category);
            return this;
        }

        public Builder goalType(GoalType goalType) {
            response.setGoalType(goalType);
            return this;
        }

        public Builder frequency(Frequency frequency) {
            response.setFrequency(frequency);
            return this;
        }

        public Builder goalValue(Integer goalValue) {
            response.setGoalValue(goalValue);
            return this;
        }

        public Builder unit(String unit) {
            response.setUnit(unit);
            return this;
        }

        public Builder icon(String icon) {
            response.setIcon(icon);
            return this;
        }

        public Builder color(String color) {
            response.setColor(color);
            return this;
        }

        public Builder currentValue(Integer currentValue) {
            response.setCurrentValue(currentValue);
            return this;
        }

        public Builder isCompleted(Boolean isCompleted) {
            response.setIsCompleted(isCompleted);
            return this;
        }

        public Builder currentStreak(Integer currentStreak) {
            response.setCurrentStreak(currentStreak);
            return this;
        }

        public Builder lastSevenDays(java.util.List<Boolean> lastSevenDays) {
            response.setLastSevenDays(lastSevenDays);
            return this;
        }

        public HabitResponse build() {
            return response;
        }
    }
}
