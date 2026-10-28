import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumComment } from '../_model/forum.model';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = 'http://localhost:8086/api/forum';
  private apiUrl = 'http://localhost:8086/api/forum';
  constructor(private http: HttpClient) {}

  // Topic related methods
  getAllTopics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/topics`);
  }

  getTopicById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/topics/${id}`);
  }

  getTopicByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/topics/name/${name}`);
  }

  createTopic(
    topic: any,
    creatorUsername: string,
    file?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('name', topic.name);
    formData.append('description', topic.description);

    if (file) {
      formData.append('file', file);
    }

    const params = new HttpParams().set('creatorUsername', creatorUsername);
    return this.http.post<any>(`${this.baseUrl}/topics`, formData, { params });
  }

  updateTopic(id: number, topic: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/topics/${id}`, topic);
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/topics/${id}`);
  }

  getTopicsByCreator(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/topics/creator/${username}`);
  }

  // Post related methods
  getAllPosts(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/posts`, { params });
  }

  getPostsByTopic(
    topicId: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/posts/topic/${topicId}`, {
      params,
    });
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/posts/${id}`);
  }

  // createPost(post: any, topicId: number, authorUsername: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('topicId', topicId.toString())
  //     .set('authorUsername', authorUsername);
  //   return this.http.post<any>(`${this.baseUrl}/posts`, post, { params });
  // }

  createPost(
    post: any,
    topicId: number,
    authorUsername: string,
    file?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('title', post.title); // Add this line
    formData.append('content', post.content);
    formData.append('topicId', topicId.toString());
    formData.append('authorUsername', authorUsername);

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<any>(`${this.baseUrl}/posts`, formData);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/posts/${id}`);
  }

  getPostsByAuthor(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts/author/${username}`);
  }

  searchPosts(
    query: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/posts/search`, { params });
  }

  getCommentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comments/${id}`);
  }

  updateComment(id: number, comment: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/comments/${id}`, comment);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/comments/${id}`);
  }

  getCommentsByAuthor(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comments/author/${username}`);
  }

  getRepliesByComment(commentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/comments/replies/${commentId}`
    );
  }

  // Like related methods

  getLikesByPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/likes/post/${postId}`);
  }

  getLikesByUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/likes/user/${username}`);
  }

  getCommentsByPost(postId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(
      `${this.apiUrl}/comments/post/${postId}`
    );
  }

  createComment(
    comment: ForumComment,
    postId: number,
    authorUsername: string,
    parentCommentId?: number
  ): Observable<ForumComment> {
    // Use HttpParams to build parameters safely
    let params = new HttpParams()
      .set('postId', postId.toString())
      .set('authorUsername', authorUsername);

    if (parentCommentId) {
      params = params.set('parentCommentId', parentCommentId.toString());
    }

    return this.http.post<ForumComment>(`${this.apiUrl}/comments`, comment, {
      params,
    });
  }

  toggleLike(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/likes/toggle?postId=${postId}&username=${username}`,
      {}
    );
  }

  countLikesByPost(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/likes/count/${postId}`);
  }

  hasUserLikedPost(postId: number, username: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/likes/check?postId=${postId}&username=${username}`
    );
  }
}
