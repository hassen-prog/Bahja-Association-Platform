package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.service.ForumPostService;
import com.example.bahjaassociation.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/forum/posts")
public class ForumPostController {

    @Autowired
    private ForumPostService forumPostService;
    @Autowired
    private FileStorageService fileStorageService;
    @GetMapping
    public ResponseEntity<Page<ForumPost>> getAllPosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(forumPostService.getAllPosts(pageable));
    }
    
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<Page<ForumPost>> getPostsByTopic(
            @PathVariable Long topicId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(forumPostService.getPostsByTopic(topicId, pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(forumPostService.getPostById(id));
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("isAuthenticated()")
public ResponseEntity<ForumPost> createPost(

            @RequestParam("title") String title,
        @RequestParam("content") String content, // Example post field
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam Long topicId,
        @RequestParam String authorUsername) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    // 1. Handle file upload
    String fileUrlPost = null;
    if (file != null && !file.isEmpty()) {
        String fileName = fileStorageService.storeFile(file);
        fileUrlPost = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
    }

    // 2. Create the post object manually
    ForumPost post = new ForumPost();
        post.setTitle(title);
        post.setContent(content); // Set other fields as needed (e.g., title)

    // 3. Call the service with the file URL
    return ResponseEntity.ok(
            forumPostService.createPost(post, topicId, authorUsername, fileUrlPost)
    );
}




    @PutMapping("/{id}")
    public ResponseEntity<ForumPost> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody ForumPost postDetails) {
        return ResponseEntity.ok(forumPostService.updatePost(id, postDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        forumPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/author/{username}")
    public ResponseEntity<List<ForumPost>> getPostsByAuthor(@PathVariable String username) {
        return ResponseEntity.ok(forumPostService.getPostsByAuthor(username));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<ForumPost>> searchPosts(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(forumPostService.searchPosts(query, pageable));
    }
} 