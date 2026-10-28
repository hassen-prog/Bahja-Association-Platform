package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ForumLike;
import com.example.bahjaassociation.service.ForumLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum/likes")
public class ForumLikeController {

    @Autowired
    private ForumLikeService forumLikeService;
    
    @PostMapping("/toggle")
    //@PreAuthorize("hasRole('User')")
    public ResponseEntity<?> toggleLike(
            @RequestParam Long postId,
            @RequestParam String username) {
        ForumLike like = forumLikeService.toggleLike(postId, username);
        
        if (like == null) {
            return ResponseEntity.ok().body("Like removed");
        } else {
            return ResponseEntity.ok(like);
        }
    }
    
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> countLikesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(forumLikeService.countLikesByPost(postId));
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ForumLike>> getLikesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(forumLikeService.getLikesByPost(postId));
    }
    
    @GetMapping("/user/{username}")
    public ResponseEntity<List<ForumLike>> getLikesByUser(@PathVariable String username) {
        return ResponseEntity.ok(forumLikeService.getLikesByUser(username));
    }
    
    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserLikedPost(
            @RequestParam Long postId,
            @RequestParam String username) {
        return ResponseEntity.ok(forumLikeService.hasUserLikedPost(postId, username));
    }
} 