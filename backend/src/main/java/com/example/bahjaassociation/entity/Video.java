package com.example.bahjaassociation.entity;

import lombok.Data;

import javax.persistence.*;
@Data
@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String videoId;

}