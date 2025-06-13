import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, timer, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ChatMessage } from '../_model/chat-message';
import { User } from '../_model/user.model';
import { UserAuthService } from './user-auth.service';

// Only import SockJS and StompJS when needed
let SockJS: any;
let StompJS: any;

// Flag to temporarily disable WebSockets and use HTTP polling instead
const USE_HTTP_POLLING = true;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8086/api/chat';
  private stompClient: any = null;
  private messageSubject = new Subject<ChatMessage>();
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private polling: any = null;
  public messages$ = this.messageSubject.asObservable();
  public connected$ = this.connectedSubject.asObservable();
  private lastCheckTime = new Date();
  private currentUsername: string;
  
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {
    // Initialize username from UserAuthService
    this.currentUsername = this.userAuthService.getUsername();
    
    // If username is empty, something is wrong with auth, try to get from local storage
    if (!this.currentUsername || this.currentUsername.trim() === '') {
      const user = this.userAuthService.getUser();
      if (user && user.userName) {
        this.currentUsername = user.userName;
        // Fix the discrepancy by storing it properly
        this.userAuthService.setUsername(user.userName);
      }
    }
    
    console.log('Chat service initialized for user:', this.currentUsername);
  }

  // Check/update username before any critical operation
  private ensureUsername(): string {
    if (!this.currentUsername || this.currentUsername.trim() === '') {
      // Try to recover username
      const user = this.userAuthService.getUser();
      if (user && user.userName) {
        this.currentUsername = user.userName;
        this.userAuthService.setUsername(user.userName);
        console.log('Username recovered from user object:', this.currentUsername);
      } else {
        console.error('Failed to recover username, using fallback');
        // Use a fallback to avoid empty sender
        this.currentUsername = 'unknown_user';
      }
    }
    return this.currentUsername;
  }

  // Connect to the WebSocket server or start HTTP polling
  connect(): void {
    // Ensure username is valid
    this.ensureUsername();
    
    if (USE_HTTP_POLLING) {
      this.startPolling();
      return;
    }

    if (this.stompClient) {
      return;
    }

    // Dynamically import WebSocket libraries only when needed
    Promise.all([
      import('sockjs-client'),
      import('@stomp/stompjs')
    ]).then(([sockjs, stomp]) => {
      SockJS = sockjs.default;
      StompJS = stomp;

      const socket = new SockJS('http://localhost:8086/ws');
      this.stompClient = new StompJS.Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      const username = this.ensureUsername();

      this.stompClient.onConnect = (frame: any) => {
        this.connectedSubject.next(true);
        
        // Subscribe to personal messages
        this.stompClient?.subscribe(`/user/${username}/queue/messages`, (message: any) => {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          this.messageSubject.next(chatMessage);
        });
      };

      this.stompClient.onStompError = (frame: any) => {
        console.error('STOMP error', frame);
        this.connectedSubject.next(false);
        // Fallback to polling
        this.startPolling();
      };

      this.stompClient.activate();
    }).catch(error => {
      console.error('Error loading WebSocket libraries', error);
      // Fallback to polling
      this.startPolling();
    });
  }

  // Start polling for new messages
  private startPolling(): void {
    // Ensure username is valid before polling
    const username = this.ensureUsername();
    
    if (this.polling) {
      return;
    }

    console.log('Starting HTTP polling for messages for user:', username);
    this.connectedSubject.next(true);
    
    // Poll every 3 seconds
    this.polling = timer(0, 3000).pipe(
      switchMap(() => this.getUnreadMessages().pipe(
        catchError(error => {
          console.error('Error polling for messages', error);
          return of([]);
        })
      ))
    ).subscribe(messages => {
      if (messages.length > 0) {
        console.log('Received messages via polling:', messages);
        
        // We need to check for parents/admins list empty state and reload them if needed
        if (messages.some(m => m.receiverUsername === username)) {
          console.log('Received message for current user, checking if we need to reload contacts');
          this.getChatPartners().subscribe(partners => {
            console.log('Updated chat partners:', partners);
          });
        }
        
        messages.forEach(message => {
          // Process messages where current user is either the receiver or sender
          if (message.receiverUsername === username || 
              message.senderUsername === username) {
            console.log('Processing message:', message, 'Current user:', username);
            
            // Create a local copy to avoid reference issues
            const localMessage = new ChatMessage();
            localMessage.id = message.id;
            localMessage.content = message.content;
            localMessage.senderUsername = message.senderUsername; 
            localMessage.receiverUsername = message.receiverUsername;
            localMessage.timestamp = message.timestamp || new Date();
            localMessage.isRead = message.isRead;
            
            this.messageSubject.next(localMessage);
          }
        });
      }
    });
  }

  // Disconnect from the WebSocket server or stop polling
  disconnect(): void {
    if (this.polling) {
      this.polling.unsubscribe();
      this.polling = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    
    this.connectedSubject.next(false);
  }

  // Send a message via WebSocket or HTTP
  sendMessage(chatMessage: ChatMessage): void {
    // Make sure sender is set to current user and username is valid
    const username = this.ensureUsername();
    chatMessage.senderUsername = username;
    console.log('Sending message with sender:', username, 'to:', chatMessage.receiverUsername);
    
    if (!USE_HTTP_POLLING && this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    } else {
      // Use HTTP if WebSockets are disabled or not connected
      console.log('Sending message via HTTP from', username, 'to', chatMessage.receiverUsername);
      this.sendMessageHttp(chatMessage).subscribe(
        (response) => {
          // Add the sent message to the messageSubject so it's handled by subscribers
          console.log('Message sent successfully, response:', response);
          
          // Create a local copy to avoid reference issues
          const localMessage = new ChatMessage();
          localMessage.id = response?.id || chatMessage.id;
          localMessage.content = chatMessage.content;
          localMessage.senderUsername = username; // Ensure correct sender
          localMessage.receiverUsername = chatMessage.receiverUsername;
          localMessage.timestamp = new Date();
          localMessage.isRead = false;
          
          // Emit the message so it appears in all connected windows
          console.log('Emitting local message with sender:', localMessage.senderUsername);
          this.messageSubject.next(localMessage);
        },
        (error) => {
          console.error('Failed to send message via HTTP', error);
        }
      );
    }
  }

  // Mark messages as read
  markMessagesAsRead(senderUsername: string, receiverUsername: string): void {
    if (!USE_HTTP_POLLING && this.stompClient && this.stompClient.connected) {
      const readInfo = new ChatMessage();
      readInfo.senderUsername = senderUsername;
      readInfo.receiverUsername = receiverUsername;
      
      this.stompClient.publish({
        destination: '/app/chat.readMessages',
        body: JSON.stringify(readInfo)
      });
    }
    // For HTTP polling, we'll just rely on the API endpoint being called when loading chat history
  }

  // HTTP Methods for REST API calls

  // Get chat history with another user
  getChatHistory(otherUsername: string): Observable<ChatMessage[]> {
    const username = this.ensureUsername();
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${otherUsername}`).pipe(
      map(messages => {
        console.log(`Got chat history between ${username} and ${otherUsername}:`, messages);
        // Don't modify the sender/receiver info - keep as is from the server
        return messages;
      }),
      catchError(error => {
        console.error('Error getting chat history:', error);
        return of([]);
      })
    );
  }

  // Get unread messages
  getUnreadMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/unread`).pipe(
      map(messages => {
        // Make sure messages have the correct sender/receiver info
        messages.forEach(msg => {
          console.log('Processing unread message:', msg);
          // Don't modify the sender/receiver info - keep as is from the server
        });
        return messages;
      }),
      catchError(error => {
        console.error('Error getting unread messages:', error);
        return of([]);
      })
    );
  }

  // Send a message (HTTP method)
  sendMessageHttp(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, chatMessage);
  }

  // Get all chat partners (users you've chatted with)
  getChatPartners(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/partners`);
  }

  // Get all admin users (for parents to select from)
  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admins`);
  }

  // Get all parent users (for admins to select from)
  getAllParents(): Observable<User[]> {
    console.log('Getting all parents');
    return this.http.get<User[]>(`${this.apiUrl}/parents`).pipe(
      map(parents => {
        console.log('Parent list response:', parents);
        return parents;
      }),
      catchError(error => {
        console.error('Error getting parents:', error);
        return of([]);
      })
    );
  }
} 