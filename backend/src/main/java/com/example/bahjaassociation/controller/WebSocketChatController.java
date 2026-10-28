package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.ChatMessage;
import com.example.bahjaassociation.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ChatService chatService;
    
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Save the message to the database
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);
        
        // Send to the specific user
        messagingTemplate.convertAndSendToUser(
            chatMessage.getReceiverUsername(),
            "/queue/messages",
            savedMessage
        );
    }
    
    @MessageMapping("/chat.readMessages")
    public void readMessages(@Payload ChatMessage readInfo) {
        // Mark messages as read
        chatService.markMessagesAsRead(readInfo.getSenderUsername(), readInfo.getReceiverUsername());
    }
} 