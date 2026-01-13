package com.flowstate.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "habit_logs")
public class HabitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Column(nullable = false)
    private LocalDate date;

    private Integer currentValue = 0;

    private Boolean isCompleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public HabitLog() {
    }

    public HabitLog(UUID id, Habit habit, LocalDate date, Integer currentValue, Boolean isCompleted,
            LocalDateTime createdAt) {
        this.id = id;
        this.habit = habit;
        this.date = date;
        this.currentValue = currentValue != null ? currentValue : 0;
        this.isCompleted = isCompleted != null ? isCompleted : false;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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
        private HabitLog log = new HabitLog();

        public Builder id(UUID id) {
            log.setId(id);
            return this;
        }

        public Builder habit(Habit habit) {
            log.setHabit(habit);
            return this;
        }

        public Builder date(LocalDate date) {
            log.setDate(date);
            return this;
        }

        public Builder currentValue(Integer currentValue) {
            log.setCurrentValue(currentValue);
            return this;
        }

        public Builder isCompleted(Boolean isCompleted) {
            log.setIsCompleted(isCompleted);
            return this;
        }

        public HabitLog build() {
            return log;
        }
    }
}
