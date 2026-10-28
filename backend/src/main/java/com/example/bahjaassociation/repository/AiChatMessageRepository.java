package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.AiChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findByConversationIdOrderByTimestampAsc(Long conversationId);
    void deleteByConversationId(Long conversationId);
}