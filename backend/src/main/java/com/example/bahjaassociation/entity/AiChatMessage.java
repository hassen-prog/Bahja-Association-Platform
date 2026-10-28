package com.example.bahjaassociation.entity;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import javax.persistence.Entity;

@Data
@Entity
public class AiChatMessage {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private AiConversation conversation;

    private String role; // "user" or "ai"

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

}
