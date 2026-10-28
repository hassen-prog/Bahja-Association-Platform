package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.Book;
import com.example.bahjaassociation.repository.BookRepository;
import com.example.bahjaassociation.service.BookService;
import com.example.bahjaassociation.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private FileStorageService fileStorageService;




    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        if (book != null) {
            return ResponseEntity.ok(book);
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Book>> getRecommendedBooks(@PathVariable Long id) {
        Book currentBook = bookService.getBookById(id);
        if (currentBook == null) {
            return ResponseEntity.notFound().build();
        }

        List<Book> recommended = bookService.getBooksByAuthorExcludingId(currentBook.getAuthor(), id);
        return ResponseEntity.ok(recommended);
    }


    @PostMapping("/add")
    public Book addBook(@RequestParam("title") String title, @RequestParam("author") String author,
                        @RequestParam("description") String description, @RequestParam("file") MultipartFile file,@RequestParam("pdfFile") MultipartFile pdfFile) {
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
        //for pdf
        String uploadDir = "uploads/books";
        String fileNameBook = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileNameBook);
        try {
            Files.createDirectories(filePath.getParent());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            Files.copy(pdfFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String fileUrl = "/books/" + fileNameBook;
        Book newBook = new Book();
        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setDescription(description);
        newBook.setCoverImageUrl(fileDownloadUri);
        newBook.setPdfUrl(fileUrl);
        return bookRepository.save(newBook);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestParam("title") String title,
                                           @RequestParam("author") String author, @RequestParam("description") String description,
                                           @RequestParam("file") MultipartFile file) {
        Book book = bookService.getBookById(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        book.setTitle(title);
        book.setAuthor(author);
        book.setDescription(description);
        book.setCoverImageUrl(fileDownloadUri);

        Book updatedBook = bookRepository.save(book);
        return ResponseEntity.ok(updatedBook);
    }





    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        if (book != null) {
            bookRepository.delete(book);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}

