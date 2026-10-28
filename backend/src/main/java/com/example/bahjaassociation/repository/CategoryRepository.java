package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}