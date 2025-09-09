
package com.fakebook.model;

import java.util.Objects;
import java.time.LocalDateTime;

public class Report {
	private int postId;
	private String username;
	private LocalDateTime createdAt;

	public Report() {
	}

	public Report(int postId, String username, LocalDateTime createdAt) {
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
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Report report = (Report) o;
		return postId == report.postId &&
				Objects.equals(username, report.username) &&
				Objects.equals(createdAt, report.createdAt);
	}

	@Override
	public int hashCode() {
		return Objects.hash(postId, username, createdAt);
	}
}
