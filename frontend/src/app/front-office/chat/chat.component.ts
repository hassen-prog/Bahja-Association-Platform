import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../_services/chat.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { ChatMessage } from '../../_model/chat-message';
import { User } from '../../_model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  admins: User[] = [];
  selectedAdmin: User | null = null;
  chatPartners: User[] = [];
  currentUser: string;
  loading = false;
  error = '';
  unreadMessages: ChatMessage[] = [];
  private messagesSubscription: Subscription | null = null;
  private connectedSubscription: Subscription | null = null;
  isConnected = false;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private userAuthService: UserAuthService
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]]
    });
    this.currentUser = this.userAuthService.getUsername();
  }

  ngOnInit(): void {
    // Connect to service (WebSocket or HTTP polling)
    this.chatService.connect();
    
    // Listen for connection status
    this.connectedSubscription = this.chatService.connected$.subscribe(
      (connected) => {
        this.isConnected = connected;
      }
    );
    
    // Listen for incoming messages
    this.messagesSubscription = this.chatService.messages$.subscribe(
      (message: ChatMessage) => {
        console.log('Chat component received message:', message);
        
        // Don't add duplicate messages
        if (message.id && this.messages.some(m => m.id === message.id)) {
          console.log('Duplicate message detected, ignoring');
          return;
        }
        
        // Only add messages relevant to the current conversation
        if (this.selectedAdmin && 
            ((message.senderUsername === this.selectedAdmin.userName && message.receiverUsername === this.currentUser) || 
             (message.receiverUsername === this.selectedAdmin.userName && message.senderUsername === this.currentUser))) {
          console.log('Adding message to current conversation with', this.selectedAdmin.userName);
          this.messages.push(message);
          
          // Mark message as read if we are the receiver
          if (message.receiverUsername === this.currentUser) {
            this.chatService.markMessagesAsRead(message.senderUsername, this.currentUser);
          }
        } else {
          // Add to unread messages if we're not currently viewing this chat and we are the receiver
          if (message.receiverUsername === this.currentUser) {
            console.log('Adding to unread messages from', message.senderUsername);
            this.unreadMessages.push(message);
          }
        }
      }
    );
    
    // Load chat partners
    this.loadChatPartners();
    
    // Load admin users
    this.loadAdmins();
    
    // Load unread messages
    this.loadUnreadMessages();
  }

  ngOnDestroy(): void {
    // Disconnect service
    this.chatService.disconnect();
    
    // Unsubscribe from messages
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
      this.messagesSubscription = null;
    }
    
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe();
      this.connectedSubscription = null;
    }
  }

  loadAdmins(): void {
    this.loading = true;
    this.chatService.getAllAdmins().subscribe(
      (admins) => {
        this.admins = admins;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load admin users';
        this.loading = false;
        console.error(error);
      }
    );
  }

  loadChatPartners(): void {
    this.loading = true;
    this.chatService.getChatPartners().subscribe(
      (partners) => {
        this.chatPartners = partners;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load chat partners';
        this.loading = false;
        console.error(error);
      }
    );
  }

  loadUnreadMessages(): void {
    this.chatService.getUnreadMessages().subscribe(
      (messages) => {
        this.unreadMessages = messages;
      },
      (error) => {
        console.error('Failed to load unread messages', error);
      }
    );
  }

  selectAdmin(admin: User): void {
    this.selectedAdmin = admin;
    this.loadChatHistory(admin.userName);
  }

  loadChatHistory(username: string): void {
    this.loading = true;
    this.chatService.getChatHistory(username).subscribe(
      (messages) => {
        this.messages = messages;
        this.loading = false;
        
        // Mark messages as read
        this.chatService.markMessagesAsRead(username, this.currentUser);
        
        // Remove from unread
        this.unreadMessages = this.unreadMessages.filter(
          msg => msg.senderUsername !== username
        );
      },
      (error) => {
        this.error = 'Failed to load chat history';
        this.loading = false;
        console.error(error);
      }
    );
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.selectedAdmin) {
      return;
    }

    const content = this.messageForm.get('message')?.value;
    
    const message = new ChatMessage();
    message.content = content;
    message.receiverUsername = this.selectedAdmin.userName;
    
    // Make sure we set the sender correctly
    message.senderUsername = this.currentUser;
    message.timestamp = new Date();
    
    console.log('User sending message:', {
      sender: this.currentUser,
      receiver: this.selectedAdmin.userName,
      content: content
    });
    
    // Add to local messages BEFORE sending
    // This creates a copy that won't be affected by changes
    const localMessage = new ChatMessage();
    localMessage.content = content;
    localMessage.senderUsername = this.currentUser;
    localMessage.receiverUsername = this.selectedAdmin.userName;
    localMessage.timestamp = new Date();
    this.messages.push(localMessage);
    
    // Send via service
    this.chatService.sendMessage(message);
    
    // Reset form
    this.messageForm.reset();
  }

  hasUnreadMessages(username: string): boolean {
    return this.unreadMessages.some(msg => msg.senderUsername === username);
  }
} 