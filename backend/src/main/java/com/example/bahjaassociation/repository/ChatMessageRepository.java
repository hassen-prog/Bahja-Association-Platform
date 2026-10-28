package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Find chat history between two users
    List<ChatMessage> findBySenderUsernameAndReceiverUsernameOrSenderUsernameAndReceiverUsernameOrderByTimestampAsc(
        String sender1, String receiver1, String sender2, String receiver2);
    
    // Find unread messages for a user
    List<ChatMessage> findByReceiverUsernameAndIsReadFalseOrderByTimestampAsc(String receiverUsername);
    
    // Find all chat partners for a user (people they've chatted with)
    List<ChatMessage> findBySenderUsernameOrReceiverUsername(String username1, String username2);
} 