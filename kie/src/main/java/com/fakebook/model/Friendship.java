package com.fakebook.model;

public class Friendship {
    private String username1;
    private String username2;

    public Friendship(String username1, String username2) {
        this.username1 = username1;
        this.username2 = username2;
    }

    public String getUsername1() {
        return username1;
    }

    public void setUsername1(String username1) {
        this.username1 = username1;
    }

    public String getUsername2() {
        return username2;
    }

    public void setUsername2(String username2) {
        this.username2 = username2;
    }

    public boolean isFriend(String username) {
        return username1.equals(username) || username2.equals(username);
    }

    public String getFriendOf(String username) {
        if (username1.equals(username)) {
            return username2;
        } else if (username2.equals(username)) {
            return username1;
        }
        return null;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Friendship friendship = (Friendship) obj;
        return (username1.equals(friendship.username1) && username2.equals(friendship.username2)) ||
               (username1.equals(friendship.username2) && username2.equals(friendship.username1));
    }

    @Override
    public int hashCode() {
        return username1.hashCode() + username2.hashCode();
    }
}