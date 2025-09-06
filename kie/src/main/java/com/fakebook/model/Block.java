package com.fakebook.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class Block {
	private String username;
	private String blockedUsername;
	private LocalDateTime createdAt;

	public Block() {
	}

	public Block(String username, String blockedUsername, LocalDateTime createdAt) {
		this.username = username;
		this.blockedUsername = blockedUsername;
		this.createdAt = createdAt;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getBlockedUsername() {
		return blockedUsername;
	}

	public void setBlockedUsername(String blockedUsername) {
		this.blockedUsername = blockedUsername;
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
		Block block = (Block) o;
		return Objects.equals(username, block.username) &&
				Objects.equals(blockedUsername, block.blockedUsername);
	}

	@Override
	public int hashCode() {
		return Objects.hash(username, blockedUsername);
	}
}
