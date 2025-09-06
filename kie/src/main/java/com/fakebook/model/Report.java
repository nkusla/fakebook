
package com.fakebook.model;

import java.util.Objects;

public class Report {
	private int postId;
	private String username;
	private String createdAt;

	public Report() {
	}

	public Report(int postId, String username, String createdAt) {
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
