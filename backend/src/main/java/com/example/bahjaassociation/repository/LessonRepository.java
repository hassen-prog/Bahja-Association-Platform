package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}