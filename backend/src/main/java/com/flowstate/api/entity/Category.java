package com.flowstate.api.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color; // Key like 'indigo', 'rose', etc.

    @Column(nullable = false)
    private String icon; // Material icon name

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Category() {
    }

    public Category(User user, String name, String color, String icon) {
        this.user = user;
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
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
        private Category category = new Category();

        public Builder user(User user) {
            category.setUser(user);
            return this;
        }

        public Builder name(String name) {
            category.setName(name);
            return this;
        }

        public Builder color(String color) {
            category.setColor(color);
            return this;
        }

        public Builder icon(String icon) {
            category.setIcon(icon);
            return this;
        }

        public Category build() {
            return category;
        }
    }
}
