package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.ForumComment;
import com.example.bahjaassociation.entity.ForumPost;
import com.example.bahjaassociation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    List<ForumComment> findByPostAndIsActiveTrueOrderByCreatedAt(ForumPost post);
    List<ForumComment> findByAuthorAndIsActiveTrue(User author);
    List<ForumComment> findByParentCommentAndIsActiveTrue(ForumComment parentComment);
} 