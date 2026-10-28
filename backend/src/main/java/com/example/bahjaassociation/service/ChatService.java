package com.example.bahjaassociation.service;

import com.example.bahjaassociation.entity.ChatMessage;
import com.example.bahjaassociation.entity.User;
import com.example.bahjaassociation.repository.ChatMessageRepository;
import com.example.bahjaassociation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Save a new chat message
    public ChatMessage saveMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }
    
    // Get chat history between two users
    public List<ChatMessage> getChatHistory(String user1, String user2) {
        return chatMessageRepository.findBySenderUsernameAndReceiverUsernameOrSenderUsernameAndReceiverUsernameOrderByTimestampAsc(
            user1, user2, user2, user1);
    }
    
    // Get unread messages for a user
    public List<ChatMessage> getUnreadMessages(String username) {
        return chatMessageRepository.findByReceiverUsernameAndIsReadFalseOrderByTimestampAsc(username);
    }
    
    // Mark messages as read
    public void markMessagesAsRead(String senderUsername, String receiverUsername) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findBySenderUsernameAndReceiverUsernameOrSenderUsernameAndReceiverUsernameOrderByTimestampAsc(
            senderUsername, receiverUsername, receiverUsername, senderUsername);
        
        unreadMessages.forEach(message -> {
            if (message.getReceiverUsername().equals(receiverUsername) && !message.isRead()) {
                message.setRead(true);
                chatMessageRepository.save(message);
            }
        });
    }
    
    // Get all chat partners for a user (admins for parents, parents for admins)
    public List<User> getChatPartners(String username) {
        // Get all messages where the user is sender or receiver
        List<ChatMessage> messages = chatMessageRepository.findBySenderUsernameOrReceiverUsername(username, username);
        
        // Extract unique usernames excluding the current user
        Set<String> partnerUsernames = messages.stream()
            .map(message -> {
                if (message.getSenderUsername().equals(username)) {
                    return message.getReceiverUsername();
                } else {
                    return message.getSenderUsername();
                }
            })
            .collect(Collectors.toSet());
        
        // Find the User objects for these usernames
        return partnerUsernames.stream()
            .map(partnerUsername -> userRepository.findByUserName(partnerUsername))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    // Get all admin users for parents to select from
    public List<User> getAllAdmins() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
            .filter(user -> {
                Set<com.example.bahjaassociation.entity.Role> roles = user.getRole();
                return roles.stream().anyMatch(role -> "Admin".equals(role.getRoleName()));
            })
            .collect(Collectors.toList());
    }
    
    // Get all parent users for admins to select from
    public List<User> getAllParents() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
            .filter(user -> {
                Set<com.example.bahjaassociation.entity.Role> roles = user.getRole();
                return roles.stream().anyMatch(role -> "User".equals(role.getRoleName()));
            })
            .collect(Collectors.toList());
    }
} 