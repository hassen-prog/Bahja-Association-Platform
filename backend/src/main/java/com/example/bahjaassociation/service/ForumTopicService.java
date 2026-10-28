package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.ForumTopic;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.ForumTopicRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumTopicService {

    @Autowired
    private ForumTopicRepository forumTopicRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ForumTopic> getAllTopics() {
        return forumTopicRepository.findByIsActiveTrue();
    }
    
    public ForumTopic getTopicById(Long id) {
        return forumTopicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
    }
    
    public ForumTopic getTopicByName(String name) {
        return forumTopicRepository.findByNameAndIsActiveTrue(name)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
    }
    
    public ForumTopic createTopic(ForumTopic topic, String creatorUsername) {
        if (forumTopicRepository.existsByName(topic.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Topic name already exists");
        }
        
        User creator = userRepository.findById(creatorUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        topic.setCreator(creator);
        topic.setCreatedAt(LocalDateTime.now());
        topic.setActive(true);
        
        return forumTopicRepository.save(topic);
    }
    
    public ForumTopic createTopic(ForumTopic topic, String creatorUsername, String fileUrl) {
        try {
            if (forumTopicRepository.existsByName(topic.getName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Topic name already exists");
            }
            
            User creator = userRepository.findById(creatorUsername)
                    .orElseThrow(() -> {
                        System.out.println("User not found: " + creatorUsername);
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + creatorUsername);
                    });
            
            topic.setCreator(creator);
            topic.setCreatedAt(LocalDateTime.now());
            topic.setActive(true);
            topic.setFileUrl(fileUrl);
            
            System.out.println("Creating forum topic: " + topic.getName() + " by user: " + creatorUsername);
            return forumTopicRepository.save(topic);
        } catch (Exception e) {
            System.err.println("Error creating forum topic: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public ForumTopic updateTopic(Long id, ForumTopic topicDetails) {
        ForumTopic topic = getTopicById(id);
        
        if (!topic.getName().equals(topicDetails.getName()) && forumTopicRepository.existsByName(topicDetails.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Topic name already exists");
        }
        
        topic.setName(topicDetails.getName());
        topic.setDescription(topicDetails.getDescription());
        
        return forumTopicRepository.save(topic);
    }
    
    public void deleteTopic(Long id) {
        ForumTopic topic = getTopicById(id);
        topic.setActive(false);
        forumTopicRepository.save(topic);
    }
    
    public List<ForumTopic> getTopicsByCreator(String username) {
        User creator = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return forumTopicRepository.findByCreator(creator);
    }
} 