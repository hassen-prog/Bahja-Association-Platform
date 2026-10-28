package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.dto.openrouter.ChatCompletionRequest;
import com.example.bahjaassociation.dto.openrouter.ChatCompletionResponse;
import com.example.bahjaassociation.dto.openrouter.ChatMessage;
import com.example.bahjaassociation.entity.AiChatMessage;
import com.example.bahjaassociation.entity.AiConversation;
import com.example.bahjaassociation.service.AiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/*@RestController
@RequestMapping("/api/ai")
public class OpenRouterController {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/generate")
    public ResponseEntity<?> generateScript(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        String userRole = body.getOrDefault("userRole", "").toLowerCase();
        String systemPrompt = switch (userRole) {
            case "parent" -> "You are a compassionate assistant helping parents of children with cancer. You provide emotional support, helpful answers, and suggest useful resources.";
            case "child" -> "You are a friendly AI buddy who tells fun stories, answers questions, and helps children feel safe and happy.";
            default -> "You are a kind and helpful assistant for families affected by childhood cancer.";
        };
        // Build the message list
        List<ChatMessage> messages = List.of(
                new ChatMessage() {{
                    role = "system";
                    content = systemPrompt;
                }},
                new ChatMessage() {{
                    role = "user";
                    content = prompt;
                }}
        );

        // Create the request
        ChatCompletionRequest request = new ChatCompletionRequest();
        request.model = "nousresearch/hermes-3-llama-3.1-405b"; // or any other OpenRouter-supported model
        request.messages = messages;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<ChatCompletionRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ChatCompletionResponse> response = restTemplate.exchange(
                "https://openrouter.ai/api/v1/chat/completions",
                HttpMethod.POST,
                entity,
                ChatCompletionResponse.class
        );

        String script = response.getBody().choices.get(0).message.content.trim();

        return ResponseEntity.ok(Map.of("script", script));
    }
}
*/
@RestController
@RequestMapping("/api/ai")
public class OpenRouterController {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private AiChatService aiChatService;

    /**
     * Payload example:
     * {
     *   "prompt": "...",
     *   "userName": "...",
     *   "conversationId": 123,       // optional: existing conversation
     *   "title": "My conversation",  // used if conversationId missing, to create new
     *   "userRole": "parent"          // optional role for system prompt
     * }
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateScript(@RequestBody Map<String, Object> body) {
        String prompt = (String) body.get("prompt");
        String userRole = Optional.ofNullable((String) body.get("userRole")).orElse("").toLowerCase();
        String userName = (String) body.get("userName");
        Long conversationId = body.get("conversationId") == null ? null : Long.valueOf(body.get("conversationId").toString());
        String title = (String) body.get("title");

        if (userName == null || prompt == null) {
            return ResponseEntity.badRequest().body("Missing userName or prompt");
        }

        // Create conversation if none exists
        AiConversation conversation;
        if (conversationId != null) {
            Long finalConversationId = conversationId;
            conversation = aiChatService.getUserConversations(userName).stream()
                    .filter(c -> c.getId().equals(finalConversationId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Conversation not found for user"));
        } else {
            if (title == null || title.isBlank()) {
                title = prompt.length() > 20 ? prompt.substring(0, 20) + "..." : prompt;
            }
            conversation = aiChatService.createConversation(userName, title);
            conversationId = conversation.getId();
        }

        // Save user's prompt as message
        aiChatService.saveMessage(conversationId, "user", prompt);

        // Prepare system prompt
        String systemPrompt = switch (userRole) {
            case "parent" -> "You are a compassionate assistant helping parents of children with cancer. You provide emotional support, helpful answers, and suggest useful resources.";
            case "child" -> "You are a friendly AI buddy who tells fun stories, answers questions, and helps children feel safe and happy.";
            default -> "You are a kind and helpful assistant for families affected by childhood cancer.";
        };

        // Prepare messages for OpenRouter API (system + user prompt)
        List<ChatMessage> messages = List.of(
                new ChatMessage() {{
                    role = "system";
                    content = systemPrompt;
                }},
                new ChatMessage() {{
                    role = "user";
                    content = prompt;
                }}
        );

        // Create API request
        ChatCompletionRequest request = new ChatCompletionRequest();
        request.model = "nousresearch/hermes-3-llama-3.1-405b";
        request.messages = messages;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<ChatCompletionRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ChatCompletionResponse> response = restTemplate.exchange(
                "https://openrouter.ai/api/v1/chat/completions",
                HttpMethod.POST,
                entity,
                ChatCompletionResponse.class
        );

        String aiResponse = response.getBody().choices.get(0).message.content.trim();

        // Save AI's response message
        aiChatService.saveMessage(conversationId, "ai", aiResponse);

        return ResponseEntity.ok(Map.of(
                "conversationId", conversationId,
                "response", aiResponse
        ));
    }

    // Optionally add endpoints for fetching conversations and messages...

    @GetMapping("/conversations/{userName}")
    public ResponseEntity<?> getConversations(@PathVariable String userName) {
        List<AiConversation> conversations = aiChatService.getUserConversations(userName);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<?> getMessages(@PathVariable Long conversationId) {
        List<AiChatMessage> messages = aiChatService.getMessages(conversationId);
        return ResponseEntity.ok(messages);
    }
    @PutMapping("/conversation/{id}/title")
    public ResponseEntity<?> updateConversationTitle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String newTitle = body.get("title");
        if (newTitle == null || newTitle.isBlank()) {
            return ResponseEntity.badRequest().body("Title must not be empty");
        }

        try {
            aiChatService.updateConversationTitle(id, newTitle);
            return ResponseEntity.ok(Map.of("message", "Title updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update title: " + e.getMessage());
        }
    }
    @DeleteMapping("/conversation/{id}")
    public ResponseEntity<?> deleteConversation(@PathVariable Long id) {
        try {
            aiChatService.deleteConversation(id);
            return ResponseEntity.ok("Conversation deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete conversation");
        }
    }
}
