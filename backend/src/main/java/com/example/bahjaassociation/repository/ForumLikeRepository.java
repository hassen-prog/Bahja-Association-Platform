package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.ForumLike;
import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumLikeRepository extends JpaRepository<ForumLike, Long> {
    List<ForumLike> findByPost(ForumPost post);
    List<ForumLike> findByUser(User user);
    Optional<ForumLike> findByUserAndPost(User user, ForumPost post);
    boolean existsByUserAndPost(User user, ForumPost post);
    long countByPost(ForumPost post);
} 