package com.flowstate.api.entity;

import com.flowstate.api.enums.PostType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private PostType type;

    private String imageUrl;
    private String tag;

    private Integer likesCount = 0;

    private Integer commentsCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Post() {
    }

    public Post(UUID id, User user, String content, PostType type, String imageUrl, String tag, Integer likesCount,
            Integer commentsCount, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.type = type;
        this.imageUrl = imageUrl;
        this.tag = tag;
        this.likesCount = likesCount != null ? likesCount : 0;
        this.commentsCount = commentsCount != null ? commentsCount : 0;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PostType getType() {
        return type;
    }

    public void setType(PostType type) {
        this.type = type;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Integer getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(Integer likesCount) {
        this.likesCount = likesCount;
    }

    public Integer getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(Integer commentsCount) {
        this.commentsCount = commentsCount;
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
        private Post post = new Post();

        public Builder id(UUID id) {
            post.setId(id);
            return this;
        }

        public Builder user(User user) {
            post.setUser(user);
            return this;
        }

        public Builder content(String content) {
            post.setContent(content);
            return this;
        }

        public Builder type(PostType type) {
            post.setType(type);
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            post.setImageUrl(imageUrl);
            return this;
        }

        public Builder tag(String tag) {
            post.setTag(tag);
            return this;
        }

        public Builder likesCount(Integer likesCount) {
            post.setLikesCount(likesCount);
            return this;
        }

        public Builder commentsCount(Integer commentsCount) {
            post.setCommentsCount(commentsCount);
            return this;
        }

        public Post build() {
            return post;
        }
    }
}
