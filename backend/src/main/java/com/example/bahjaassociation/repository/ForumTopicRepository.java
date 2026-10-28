package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.ForumTopic;
import com.example.bahjaassociation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopic, Long> {
    List<ForumTopic> findByIsActiveTrue();
    List<ForumTopic> findByCreator(User creator);
    Optional<ForumTopic> findByNameAndIsActiveTrue(String name);
    boolean existsByName(String name);
} 