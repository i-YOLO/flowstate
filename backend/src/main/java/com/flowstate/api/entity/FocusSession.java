package com.flowstate.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "focus_sessions")
public class FocusSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer duration; // 实际专注分钟数

    @Column(nullable = false)
    private String status; // COMPLETED, INTERRUPTED

    @CreationTimestamp
    private LocalDateTime createdAt;

    public FocusSession() {
    }

    public FocusSession(UUID id, User user, Category category, Habit habit, LocalDateTime startTime,
            LocalDateTime endTime, Integer duration, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.habit = habit;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.status = status;
        this.createdAt = createdAt;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
        private FocusSession session = new FocusSession();

        public Builder id(UUID id) {
            session.setId(id);
            return this;
        }

        public Builder user(User user) {
            session.setUser(user);
            return this;
        }

        public Builder category(Category category) {
            session.setCategory(category);
            return this;
        }

        public Builder habit(Habit habit) {
            session.setHabit(habit);
            return this;
        }

        public Builder startTime(LocalDateTime startTime) {
            session.setStartTime(startTime);
            return this;
        }

        public Builder endTime(LocalDateTime endTime) {
            session.setEndTime(endTime);
            return this;
        }

        public Builder duration(Integer duration) {
            session.setDuration(duration);
            return this;
        }

        public Builder status(String status) {
            session.setStatus(status);
            return this;
        }

        public FocusSession build() {
            return session;
        }
    }
}
