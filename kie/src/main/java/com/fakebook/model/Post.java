package com.fakebook.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class Post {
    private int id;
    private String content;
    private String authorUsername;
    private boolean isFlagged;
    private LocalDateTime createdAt;
    private List<String> hashtags;
    private boolean isPopular;

    public Post(int id, String content, String authorUsername) {
        this.id = id;
        this.content = content;
        this.authorUsername = authorUsername;
        this.isFlagged = false;
        this.createdAt = LocalDateTime.now();
        this.hashtags = new ArrayList<>();
        this.isPopular = false;
    }

    public Post(int id, String content, String authorUsername, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.authorUsername = authorUsername;
        this.isFlagged = false;
        this.createdAt = createdAt;
        this.hashtags = new ArrayList<>();
        this.isPopular = false;
    }

    // Basic getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<String> hashtags) {
        this.hashtags = hashtags;
    }

    public boolean isPopular() {
        return isPopular;
    }

    public void setPopular(boolean popular) {
        isPopular = popular;
    }

    public boolean isNewerThanHours(int hours) {
        return createdAt.isAfter(LocalDateTime.now().minusHours(hours));
    }

    public boolean isNewerThanDays(int days) {
        return createdAt.isAfter(LocalDateTime.now().minusDays(days));
    }

    public boolean hasHashtag(String hashtag) {
        return hashtags.contains(hashtag);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Post post = (Post) obj;
        return id == post.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}