package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ForumTopic;
import com.example.bahjaassociation.service.ForumTopicService;
import com.example.bahjaassociation.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/forum/topics")
public class ForumTopicController {

    @Autowired
    private ForumTopicService forumTopicService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<List<ForumTopic>> getAllTopics() {
        return ResponseEntity.ok(forumTopicService.getAllTopics());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ForumTopic> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(forumTopicService.getTopicById(id));
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<ForumTopic> getTopicByName(@PathVariable String name) {
        return ResponseEntity.ok(forumTopicService.getTopicByName(name));
    }
    
    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ForumTopic> createTopic(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam String creatorUsername) {
        
        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
        }
        
        ForumTopic topic = new ForumTopic();
        topic.setName(name);
        topic.setDescription(description);
        
        return ResponseEntity.ok(forumTopicService.createTopic(topic, creatorUsername, fileUrl));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ForumTopic> updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody ForumTopic topicDetails) {
        return ResponseEntity.ok(forumTopicService.updateTopic(id, topicDetails));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        forumTopicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/creator/{username}")
    public ResponseEntity<List<ForumTopic>> getTopicsByCreator(@PathVariable String username) {
        return ResponseEntity.ok(forumTopicService.getTopicsByCreator(username));
    }
} 