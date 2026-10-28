package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.Book;
import com.example.bahjaassociation.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    public List<Book> getBooksByAuthorExcludingId(String author, Long excludedId) {
        return bookRepository.findByAuthorAndIdNot(author, excludedId);
    }
}
