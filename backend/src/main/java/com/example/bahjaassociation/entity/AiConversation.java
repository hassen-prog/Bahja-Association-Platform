package com.example.bahjaassociation.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import javax.persistence.Entity;
@Data
@Entity
public class AiConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_name") // <- Must match the actual column name referencing userName
    @JsonBackReference
    private User user;

    private String title;

    private LocalDateTime createdAt;

}
