package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.ForumTopic;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.ForumPostRepository;
import com.example.bahjaassociation.repository.ForumTopicRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumPostService {

    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private ForumTopicRepository forumTopicRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<ForumPost> getAllPosts(Pageable pageable) {
        return forumPostRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }
    
    public Page<ForumPost> getPostsByTopic(Long topicId, Pageable pageable) {
        ForumTopic topic = forumTopicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        
        return forumPostRepository.findByTopicAndIsActiveTrueOrderByCreatedAtDesc(topic, pageable);
    }
    
    public ForumPost getPostById(Long id) {
        return forumPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }
    
//    public ForumPost createPost(ForumPost post, Long topicId, String authorUsername) {
//        ForumTopic topic = forumTopicRepository.findById(topicId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
//
//        User author = userRepository.findById(authorUsername)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
//
//        post.setTopic(topic);
//        post.setAuthor(author);
//        post.setCreatedAt(LocalDateTime.now());
//        post.setActive(true);
//
//        return forumPostRepository.save(post);
//    }
public ForumPost createPost(ForumPost post, Long topicId, String authorUsername, String fileUrlPost) {
    ForumTopic topic = forumTopicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

    User author = userRepository.findById(authorUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    post.setTopic(topic);
    post.setAuthor(author);
    post.setCreatedAt(LocalDateTime.now());
    post.setActive(true);
    post.setFileUrlPost(fileUrlPost); // Ensure the ForumPost entity has this field and setter

    return forumPostRepository.save(post);
}
    
    public ForumPost updatePost(Long id, ForumPost postDetails) {
        ForumPost post = getPostById(id);
        
        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        post.setUpdatedAt(LocalDateTime.now());
        
        return forumPostRepository.save(post);
    }
    
    public void deletePost(Long id) {
        ForumPost post = getPostById(id);
        post.setActive(false);
        forumPostRepository.save(post);
    }
    
    public List<ForumPost> getPostsByAuthor(String username) {
        User author = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return forumPostRepository.findByAuthorAndIsActiveTrue(author);
    }
    
    public Page<ForumPost> searchPosts(String query, Pageable pageable) {
        return forumPostRepository.searchPosts(query, pageable);
    }
} 