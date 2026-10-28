package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ForumComment;
import com.example.bahjaassociation.service.ForumCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/forum/comments")
public class ForumCommentController {

    @Autowired
    private ForumCommentService forumCommentService;
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ForumComment>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(forumCommentService.getCommentsByPost(postId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ForumComment> getCommentById(@PathVariable Long id) {
        return ResponseEntity.ok(forumCommentService.getCommentById(id));
    }
    
    @PostMapping
    public ResponseEntity<ForumComment> createComment(
            @Valid @RequestBody ForumComment comment,
            @RequestParam Long postId,
            @RequestParam String authorUsername,
            @RequestParam(required = false) Long parentCommentId) {
        return ResponseEntity.ok(forumCommentService.createComment(comment, postId, authorUsername, parentCommentId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ForumComment> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody ForumComment commentDetails) {
        return ResponseEntity.ok(forumCommentService.updateComment(id, commentDetails));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Parent') or hasRole('Admin')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        forumCommentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/author/{username}")
    public ResponseEntity<List<ForumComment>> getCommentsByAuthor(@PathVariable String username) {
        return ResponseEntity.ok(forumCommentService.getCommentsByAuthor(username));
    }
    
    @GetMapping("/replies/{commentId}")
    public ResponseEntity<List<ForumComment>> getRepliesByComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(forumCommentService.getRepliesByComment(commentId));
    }
} 