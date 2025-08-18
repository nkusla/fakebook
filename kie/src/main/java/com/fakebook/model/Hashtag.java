package com.fakebook.model;

public class Hashtag {
    private String hashtag;
    private boolean isPopular;

    public Hashtag(String hashtag) {
        this.hashtag = hashtag;
        this.isPopular = false;
    }

    public String getHashtag() {
        return hashtag;
    }

    public void setHashtag(String hashtag) {
        this.hashtag = hashtag;
    }

    public boolean isPopular() {
        return isPopular;
    }

    public void setPopular(boolean popular) {
        isPopular = popular;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Hashtag that = (Hashtag) obj;
        return hashtag.equals(that.hashtag);
    }

    @Override
    public int hashCode() {
        return hashtag.hashCode();
    }
}