package com.example.bahjaassociation.dto.openrouter;

import java.util.List;

public class ChatCompletionRequest {
    public String model;
    public List<ChatMessage> messages;
    public double temperature = 0.7;
    public double top_p = 1;
    public int n = 1;
    public double frequency_penalty = 0;
    public double presence_penalty = 0;
}
