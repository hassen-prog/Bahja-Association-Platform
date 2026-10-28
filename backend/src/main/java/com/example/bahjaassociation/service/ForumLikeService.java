package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.ForumLike;
import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.ForumLikeRepository;
import com.example.bahjaassociation.repository.ForumPostRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumLikeService {

    @Autowired
    private ForumLikeRepository forumLikeRepository;
    
    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ForumLike toggleLike(Long postId, String username) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        User user = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        if (forumLikeRepository.existsByUserAndPost(user, post)) {
            ForumLike existingLike = forumLikeRepository.findByUserAndPost(user, post)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Like not found"));
            
            forumLikeRepository.delete(existingLike);
            return null;
        } else {
            ForumLike like = new ForumLike();
            like.setUser(user);
            like.setPost(post);
            like.setCreatedAt(LocalDateTime.now());
            
            return forumLikeRepository.save(like);
        }
    }
    
    public long countLikesByPost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        return forumLikeRepository.countByPost(post);
    }
    
    public List<ForumLike> getLikesByPost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        return forumLikeRepository.findByPost(post);
    }
    
    public List<ForumLike> getLikesByUser(String username) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return forumLikeRepository.findByUser(user);
    }
    
    public boolean hasUserLikedPost(Long postId, String username) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        User user = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return forumLikeRepository.existsByUserAndPost(user, post);
    }
} 