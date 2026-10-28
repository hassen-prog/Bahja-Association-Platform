package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthorAndIdNot(String author, Long id);
}
