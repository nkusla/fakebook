package com.fakebook.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class Suspend {
	private String username;
	private String suspendType;
	private int suspendDuration;
	private String reason;
	private LocalDateTime createdAt;
	private LocalDateTime expiresAt;

	public Suspend() {
		this.createdAt = LocalDateTime.now();
	}

	public Suspend(String username, String suspendType, int suspendDuration, String reason) {
		this.username = username;
		this.suspendType = suspendType;
		this.suspendDuration = suspendDuration;
		this.reason = reason;
		this.createdAt = LocalDateTime.now();
		this.expiresAt = LocalDateTime.now().plusHours(suspendDuration);
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getSuspendType() {
		return suspendType;
	}

	public void setSuspendType(String suspendType) {
		this.suspendType = suspendType;
	}

	public int getSuspendDuration() {
		return suspendDuration;
	}

	public void setSuspendDuration(int suspendDuration) {
		this.suspendDuration = suspendDuration;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime expiresAt) {
		this.expiresAt = expiresAt;
	}

	@JsonIgnore
	public boolean isExpired() {
		return LocalDateTime.now().isAfter(expiresAt);
	}

	public boolean isNewerThanHours(int hours) {
		return createdAt.isAfter(LocalDateTime.now().minusHours(hours));
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Suspend suspend = (Suspend) o;
		return Objects.equals(username, suspend.username) &&
						Objects.equals(suspendType, suspend.suspendType) &&
						Objects.equals(createdAt, suspend.createdAt);
	}

	@Override
	public int hashCode() {
		return Objects.hash(username, suspendType, createdAt);
	}
}