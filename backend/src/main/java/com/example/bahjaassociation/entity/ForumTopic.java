package com.example.bahjaassociation.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(exclude = "posts")
public class ForumTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false, length = 500)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_username")
    private User creator;
    
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ForumPost> posts = new ArrayList<>();
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    @Column(nullable = true)
    private String fileUrl;
    
    // Helper methods to manage bidirectional relationships
    public void addPost(ForumPost post) {
        posts.add(post);
        post.setTopic(this);
    }
    
    public void removePost(ForumPost post) {
        posts.remove(post);
        post.setTopic(null);
    }
} 