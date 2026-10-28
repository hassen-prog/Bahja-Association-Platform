import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AiService } from '../../_services/ai.service';
@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
})
export class AiAssistantComponent implements OnInit {
  showChat = false;
  prompt = '';
  response = '';
  userName = localStorage.getItem('username') || '';
  conversationId: number | null = null;
  conversationTitle: string = '';
  conversations: any[] = [];
  messages: { role: string; content: string }[] = [];

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.loadConversations(this.conversationId!);
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }
  loadConversations(selectedId?: number) {
    this.aiService.getUserConversations(this.userName).subscribe((convos) => {
      this.conversations = convos;

      // Only auto-load if nothing is selected or if explicitly provided
      if (selectedId) {
        this.loadConversation(selectedId);
      } else if (!this.conversationId && convos.length > 0) {
        this.loadConversation(convos[0].id);
      }
    });
  }

  loadConversation(id: number) {
    this.conversationId = id;
    const convo = this.conversations.find((c) => c.id === id);
    this.conversationTitle = convo?.title || 'Untitled';

    this.aiService.getMessages(id).subscribe((msgs) => {
      this.messages = msgs.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    });
  }
  sendMessage() {
    if (!this.prompt.trim()) return;

    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const userRole = roles[0]?.roleName?.toLowerCase() || 'parent';

    const payload = {
      prompt: this.prompt,
      userName: this.userName,
      userRole,
      conversationId: this.conversationId ?? undefined,
      title: this.conversationTitle || undefined,
    };

    // Push user message immediately
    this.messages.push({ role: 'user', content: this.prompt });

    this.aiService.generateResponse(payload).subscribe({
      next: (res) => {
        this.messages.push({ role: 'ai', content: res.response });

        // Update conversation ID if it's new
        if (!this.conversationId) {
          this.conversationId = res.conversationId;
          // this.loadConversations(); // refresh list after new convo
          this.loadConversations(res.conversationId);
        }
      },
      error: () => {
        this.messages.push({ role: 'ai', content: 'AI response failed.' });
      },
    });

    this.prompt = '';
  }

  updateConversationTitle() {
    if (!this.conversationId || !this.conversationTitle.trim()) return;
    this.aiService
      .updateConversationTitle(this.conversationId, this.conversationTitle)
      .subscribe(() => {
        const convo = this.conversations.find(
          (c) => c.id === this.conversationId
        );
        if (convo) convo.title = this.conversationTitle;
      });
  }
  startNewConversation() {
    this.conversationId = null;
    this.conversationTitle = '';
    this.messages = [];
  }
  deleteConversation(id: number) {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    this.aiService.deleteConversation(id).subscribe(() => {
      // Remove from list
      // this.conversations = this.conversations.filter((c) => c.id !== id);

      // If it was the active one, reset
      if (this.conversationId === id) {
        this.conversationId = null;
        this.conversationTitle = '';
        this.messages = [];

        // Optionally load the next available one
        // if (this.conversations.length > 0) {
        //   this.loadConversation(this.conversations[0].id);
        // }
      }
      this.loadConversations();
    });
  }
}
