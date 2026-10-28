package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.AiChatMessage;
import com.example.bahjaassociation.entity.AiConversation;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.AiChatMessageRepository;
import com.example.bahjaassociation.repository.AiConversationRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AiChatService {

    @Autowired
    private AiConversationRepository conversationRepo;

    @Autowired
    private AiChatMessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo; // Make sure you have this

    // Create a new AI conversation
    public AiConversation createConversation(String userName, String title) {
        User user = userRepo.findByUserName(userName);


        AiConversation conv = new AiConversation();
        conv.setUser(user);
        conv.setTitle(title);
        conv.setCreatedAt(LocalDateTime.now());

        return conversationRepo.save(conv);
    }

    // Get all conversations for a user
    public List<AiConversation> getUserConversations(String userName) {
        return conversationRepo.findByUser_UserName(userName);
    }

    // Get all messages for a conversation
    public List<AiChatMessage> getMessages(Long conversationId) {
        return messageRepo.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    // Save a single chat message
    public AiChatMessage saveMessage(Long conversationId, String role, String content) {
        AiConversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        AiChatMessage msg = new AiChatMessage();
        msg.setConversation(conversation);
        msg.setRole(role);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());

        return messageRepo.save(msg);
    }
    public void updateConversationTitle(Long id, String newTitle) {
        AiConversation conversation = conversationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        conversation.setTitle(newTitle);
        conversationRepo.save(conversation);
    }
    @Transactional
    public void deleteConversation(Long id) {
        // Delete messages first if cascade is not set
        messageRepo.deleteByConversationId(id);

        // Delete the conversation itself
        conversationRepo.deleteById(id);
    }
}

