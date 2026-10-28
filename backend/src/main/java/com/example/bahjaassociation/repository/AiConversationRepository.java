package com.example.bahjaassociation.repository;

import com.example.bahjaassociation.entity.AiConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiConversationRepository extends JpaRepository<AiConversation, Long> {
    List<AiConversation> findByUser_UserName(String userName);

}