package com.fakebook.model;

import java.util.Objects;
import java.time.LocalDateTime;

public class Like {
	private int postId;
	private String username;
	private LocalDateTime createdAt;

	public Like() {
	}

	public Like(int postId, String username, LocalDateTime createdAt) {
		this.postId = postId;
		this.username = username;
		this.createdAt = createdAt;
	}

	public int getPostId() {
		return postId;
	}

	public void setPostId(int postId) {
		this.postId = postId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public boolean isNewerThanHours(int hours) {
    return createdAt.isAfter(LocalDateTime.now().minusHours(hours));
  }

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null || getClass() != obj.getClass()) return false;
		Like like = (Like) obj;
		return postId == like.postId && username.equals(like.username) && createdAt.equals(like.createdAt);
	}

	@Override
	public int hashCode() {
		return Objects.hash(postId, username, createdAt);
	}
}
