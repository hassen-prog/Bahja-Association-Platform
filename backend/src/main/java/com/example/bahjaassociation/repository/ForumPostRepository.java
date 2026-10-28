package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.ForumTopic;
import com.example.bahjaassociation.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    Page<ForumPost> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<ForumPost> findByTopicAndIsActiveTrueOrderByCreatedAtDesc(ForumTopic topic, Pageable pageable);
    List<ForumPost> findByAuthorAndIsActiveTrue(User author);
    
    @Query("SELECT p FROM ForumPost p WHERE p.isActive = true AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ForumPost> searchPosts(@Param("query") String query, Pageable pageable);
} 