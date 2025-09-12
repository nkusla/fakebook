package com.fakebook.rest;

import com.fakebook.model.*;
import com.fakebook.kie.KieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/")
public class KieController {
	@Autowired
	private KieService kieService;

	@GetMapping("/ping")
	public ResponseEntity<String> ping() {
		return ResponseEntity.ok("pong");
	}

	@PostMapping("/user")
	public ResponseEntity<String> insertFact(@RequestBody User user) {
		kieService.insertFact(user);
		return ResponseEntity.ok("User inserted successfully");
	}

	@PostMapping("/post")
	public ResponseEntity<String> insertFact(@RequestBody Post post) {
		kieService.insertFact(post, "popular");
		return ResponseEntity.ok("Post inserted successfully");
	}

	@PostMapping("/friendship")
	public ResponseEntity<String> insertFact(@RequestBody Friendship friendship) {
		kieService.insertFact(friendship);
		return ResponseEntity.ok("Friendship inserted successfully");
	}

	@PostMapping("/like")
	public ResponseEntity<String> insertFact(@RequestBody Like like) {
		kieService.insertFact(like, "popular");
		return ResponseEntity.ok("Like inserted successfully");
	}

	@PostMapping("/block")
	public ResponseEntity<String> insertFact(@RequestBody Block block) {
		kieService.insertFact(block);
		return ResponseEntity.ok("Block inserted successfully");
	}

	@PostMapping("/report")
	public ResponseEntity<String> insertFact(@RequestBody Report report) {
		kieService.insertFact(report);
		return ResponseEntity.ok("Report inserted successfully");
	}

	@GetMapping("/feed/{username}")
	public ResponseEntity<List<Post>> getFeedPosts(@PathVariable String username) {
		List<Post> feedPosts = kieService.getFeedPosts(username);
		return ResponseEntity.ok(feedPosts);
	}

	@GetMapping("/feed/advanced/{username}")
	public ResponseEntity<List<Post>> getAdvancedFeedPosts(@PathVariable String username) {
		List<Post> feedPosts = kieService.getAdvancedFeedPosts(username);
		return ResponseEntity.ok(feedPosts);
	}

	@GetMapping("/suspend")
	public ResponseEntity<List<Suspend>> getUserSuspensions() {
		List<Suspend> suspensions = kieService.getUserSuspensions();
		return ResponseEntity.ok(suspensions);
	}

	@GetMapping("/facts")
	public ResponseEntity<List<Object>> getAllFacts() {
		return ResponseEntity.ok(kieService.getAllFacts());
	}

	@DeleteMapping("/facts")
	public ResponseEntity<String> deleteAllFacts() {
		kieService.deleteAllFacts();
		return ResponseEntity.ok("All facts deleted successfully");
	}
}
