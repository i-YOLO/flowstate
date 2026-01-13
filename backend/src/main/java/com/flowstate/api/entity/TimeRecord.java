package com.flowstate.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "time_records")
public class TimeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(nullable = false)
    private Integer startTime; // 距离凌晨的分钟数

    @Column(nullable = false)
    private Integer duration; // 持续分钟数

    private String category;
    private String color;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public TimeRecord() {
    }

    public TimeRecord(UUID id, User user, Habit habit, String title, String subtitle, Integer startTime,
            Integer duration, String category, String color, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.habit = habit;
        this.title = title;
        this.subtitle = subtitle;
        this.startTime = startTime;
        this.duration = duration;
        this.category = category;
        this.color = color;
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

    public Habit getHabit() {
        return habit;
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
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
        private TimeRecord record = new TimeRecord();

        public Builder id(UUID id) {
            record.setId(id);
            return this;
        }

        public Builder user(User user) {
            record.setUser(user);
            return this;
        }

        public Builder habit(Habit habit) {
            record.setHabit(habit);
            return this;
        }

        public Builder title(String title) {
            record.setTitle(title);
            return this;
        }

        public Builder subtitle(String subtitle) {
            record.setSubtitle(subtitle);
            return this;
        }

        public Builder startTime(Integer startTime) {
            record.setStartTime(startTime);
            return this;
        }

        public Builder duration(Integer duration) {
            record.setDuration(duration);
            return this;
        }

        public Builder category(String category) {
            record.setCategory(category);
            return this;
        }

        public Builder color(String color) {
            record.setColor(color);
            return this;
        }

        public TimeRecord build() {
            return record;
        }
    }
}
