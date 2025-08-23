package com.fakebook.model;

import java.util.Objects;

public class Like {
	private int postId;
	private String username;
	private String createdAt;

	public Like() {
	}

	public Like(int postId, String username, String createdAt) {
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

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
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
