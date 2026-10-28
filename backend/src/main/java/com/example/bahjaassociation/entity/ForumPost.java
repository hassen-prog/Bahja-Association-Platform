package com.example.bahjaassociation.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(exclude = {"comments", "likes"})
public class ForumPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 2000)
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = true)
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private User author;

    @Column(nullable = true)
    private String fileUrlPost;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id")
    @JsonBackReference
    private ForumTopic topic;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ForumComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<ForumLike> likes = new HashSet<>();
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    // Helper methods to manage bidirectional relationships
    public void addComment(ForumComment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
    
    public void removeComment(ForumComment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
    
    public void addLike(ForumLike like) {
        likes.add(like);
        like.setPost(this);
    }
    
    public void removeLike(ForumLike like) {
        likes.remove(like);
        like.setPost(null);
    }
} 