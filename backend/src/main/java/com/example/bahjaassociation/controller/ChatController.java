package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ChatMessage;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Get chat history between current user and another user
    @GetMapping("/history/{otherUsername}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String otherUsername) {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ChatMessage> chatHistory = chatService.getChatHistory(currentUsername, otherUsername);
        
        // Mark messages as read
        chatService.markMessagesAsRead(otherUsername, currentUsername);
        
        return ResponseEntity.ok(chatHistory);
    }

    // Get unread messages for current user
    @GetMapping("/unread")
    public ResponseEntity<List<ChatMessage>> getUnreadMessages() {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ChatMessage> unreadMessages = chatService.getUnreadMessages(currentUsername);
        return ResponseEntity.ok(unreadMessages);
    }

    // Send a message
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage chatMessage) {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Set the sender to current user
        chatMessage.setSenderUsername(currentUsername);
        
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);
        return ResponseEntity.ok(savedMessage);
    }

    // Get all users the current user has chatted with
    @GetMapping("/partners")
    public ResponseEntity<List<User>> getChatPartners() {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<User> chatPartners = chatService.getChatPartners(currentUsername);
        return ResponseEntity.ok(chatPartners);
    }

    // Get all admins (for parents to select from)
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> admins = chatService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // Get all parents (for admins to select from)
    @GetMapping("/parents")
    public ResponseEntity<List<User>> getAllParents() {
        List<User> parents = chatService.getAllParents();
        return ResponseEntity.ok(parents);
    }

    // Helper method to get current username
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        
        return null;
    }
} 