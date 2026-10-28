package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.ForumComment;
import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.ForumCommentRepository;
import com.example.bahjaassociation.repository.ForumPostRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumCommentService {

    @Autowired
    private ForumCommentRepository forumCommentRepository;
    
    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ForumComment> getCommentsByPost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        return forumCommentRepository.findByPostAndIsActiveTrueOrderByCreatedAt(post);
    }
    
    public ForumComment getCommentById(Long id) {
        return forumCommentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
    }
    
    public ForumComment createComment(ForumComment comment, Long postId, String authorUsername, Long parentCommentId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        
        User author = userRepository.findById(authorUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setActive(true);
        
        if (parentCommentId != null) {
            ForumComment parentComment = forumCommentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found"));
            
            if (!parentComment.getPost().getId().equals(postId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent comment does not belong to the specified post");
            }
            
            comment.setParentComment(parentComment);
        }
        
        return forumCommentRepository.save(comment);
    }
    
    public ForumComment updateComment(Long id, ForumComment commentDetails) {
        ForumComment comment = getCommentById(id);
        
        comment.setContent(commentDetails.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        
        return forumCommentRepository.save(comment);
    }
    
    public void deleteComment(Long id) {
        ForumComment comment = getCommentById(id);
        comment.setActive(false);
        forumCommentRepository.save(comment);
    }
    
    public List<ForumComment> getCommentsByAuthor(String username) {
        User author = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return forumCommentRepository.findByAuthorAndIsActiveTrue(author);
    }
    
    public List<ForumComment> getRepliesByComment(Long commentId) {
        ForumComment parentComment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        return forumCommentRepository.findByParentCommentAndIsActiveTrue(parentComment);
    }
} 