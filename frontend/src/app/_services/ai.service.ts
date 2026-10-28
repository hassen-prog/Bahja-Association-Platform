import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8086/api/ai';
  // generateResponse(
  //   prompt: string,
  //   userRole: string
  // ): Observable<{ script: string }> {
  //   return this.http.post<{ script: string }>(`${this.apiUrl}/generate`, {
  //     prompt,
  //     userRole,
  //   });
  // }

  // Send prompt and get response while managing conversation
  generateResponse(payload: {
    prompt: string;
    userName: string;
    userRole: string;
    conversationId?: number;
    title?: string;
  }) {
    return this.http.post<{ conversationId: number; response: string }>(
      `${this.apiUrl}/generate`,
      payload
    );
  }

  getUserConversations(userName: string) {
    return this.http.get<any[]>(`${this.apiUrl}/conversations/${userName}`);
  }

  getMessages(conversationId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/messages/${conversationId}`);
  }
  updateConversationTitle(id: number, title: string) {
    return this.http.put(`${this.apiUrl}/conversation/${id}/title`, { title });
  }
  deleteConversation(id: number) {
    return this.http.delete(`${this.apiUrl}/conversation/${id}`);
  }
}
