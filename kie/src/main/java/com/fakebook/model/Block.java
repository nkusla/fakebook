package com.fakebook.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

public class Block implements Serializable {
	private String username;
	private String blockedUsername;
	private String createdAt;

	public Block() {
		this.createdAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
	}

	public Block(String username, String blockedUsername, String createdAt) {
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
		Block block = (Block) o;
		return Objects.equals(username, block.username) &&
				Objects.equals(blockedUsername, block.blockedUsername);
	}

	@Override
	public int hashCode() {
		return Objects.hash(username, blockedUsername);
	}
}
