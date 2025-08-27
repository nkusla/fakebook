package com.fakebook.model;

import java.util.*;
import java.util.stream.*;

public class Similarity {
	public static double pearsonCorrelation(User u1, User u2, List<Post> allPosts, List<Like> allLikes) {
		Map<String, Set<Integer>> userLikes = new HashMap<>();
		userLikes.put(u1.getUsername(), new HashSet<>());
		userLikes.put(u2.getUsername(), new HashSet<>());

		for (Like like : allLikes) {
			if (like.getUsername().equals(u1.getUsername())) {
				userLikes.get(u1.getUsername()).add(like.getPostId());
			}
			if (like.getUsername().equals(u2.getUsername())) {
				userLikes.get(u2.getUsername()).add(like.getPostId());
			}
		}

		List<Integer> x = new ArrayList<>();
		List<Integer> y = new ArrayList<>();

		for (Post post : allPosts) {
			x.add(userLikes.get(u1.getUsername()).contains(post.getId()) ? 1 : 0);
			y.add(userLikes.get(u2.getUsername()).contains(post.getId()) ? 1 : 0);
		}

		double meanX = x.stream().mapToInt(i -> i).average().orElse(0);
		double meanY = y.stream().mapToInt(i -> i).average().orElse(0);

		double numerator = 0, denomX = 0, denomY = 0;
		for (int i = 0; i < x.size(); i++) {
			double dx = x.get(i) - meanX;
			double dy = y.get(i) - meanY;
			numerator += dx * dy;
			denomX += dx * dx;
			denomY += dy * dy;
		}

		double denominator = Math.sqrt(denomX * denomY);
		if (denominator == 0) return 0;
			return numerator / denominator;
	}

	public static double likerOverlap(Post postA, Post postB, List<Like> allLikes) {
		Set<String> likersA = allLikes.stream()
			.filter(like -> like.getPostId() == postA.getId())
			.map(Like::getUsername)
			.collect(Collectors.toSet());

		Set<String> likersB = allLikes.stream()
			.filter(like -> like.getPostId() == postB.getId())
			.map(Like::getUsername)
			.collect(Collectors.toSet());

		if (likersA.isEmpty() || likersB.isEmpty())
			return 0.0;

		Set<String> intersection = new HashSet<>(likersA);
		intersection.retainAll(likersB);

		double overlap = (double) intersection.size() / Math.min(likersA.size(), likersB.size());
		return overlap;
  }
}