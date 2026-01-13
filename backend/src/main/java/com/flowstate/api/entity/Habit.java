package com.flowstate.api.entity;

import com.flowstate.api.enums.GoalType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "habits")
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String category;

    @Enumerated(EnumType.STRING)
    private GoalType goalType;

    private Integer goalValue;
    private String unit;
    private String icon;
    private String color;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL)
    private List<HabitLog> logs;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Habit() {
    }

    public Habit(UUID id, User user, String name, String category, GoalType goalType, Integer goalValue, String unit,
            String icon, String color, Boolean isActive, List<HabitLog> logs, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.category = category;
        this.goalType = goalType;
        this.goalValue = goalValue;
        this.unit = unit;
        this.icon = icon;
        this.color = color;
        this.isActive = isActive != null ? isActive : true;
        this.logs = logs;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<HabitLog> getLogs() {
        return logs;
    }

    public void setLogs(List<HabitLog> logs) {
        this.logs = logs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Habit habit = new Habit();

        public Builder id(UUID id) {
            habit.setId(id);
            return this;
        }

        public Builder user(User user) {
            habit.setUser(user);
            return this;
        }

        public Builder name(String name) {
            habit.setName(name);
            return this;
        }

        public Builder category(String category) {
            habit.setCategory(category);
            return this;
        }

        public Builder goalType(GoalType goalType) {
            habit.setGoalType(goalType);
            return this;
        }

        public Builder goalValue(Integer goalValue) {
            habit.setGoalValue(goalValue);
            return this;
        }

        public Builder unit(String unit) {
            habit.setUnit(unit);
            return this;
        }

        public Builder icon(String icon) {
            habit.setIcon(icon);
            return this;
        }

        public Builder color(String color) {
            habit.setColor(color);
            return this;
        }

        public Builder isActive(Boolean isActive) {
            habit.setIsActive(isActive);
            return this;
        }

        public Builder logs(List<HabitLog> logs) {
            habit.setLogs(logs);
            return this;
        }

        public Habit build() {
            return habit;
        }
    }
}
