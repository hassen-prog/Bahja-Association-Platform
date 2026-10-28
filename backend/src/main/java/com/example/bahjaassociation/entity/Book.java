package com.example.bahjaassociation.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
@Data
@Entity
@Getter
@Setter
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false)
    private String coverImageUrl;

    @Column(nullable = false)
    private String pdfUrl;


}
