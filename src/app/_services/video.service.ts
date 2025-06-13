import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = 'http://localhost:8086/api/videos';

  constructor(private http: HttpClient) { }

  getVideos(): Observable<any> {
    return this.http.get(this.baseUrl);
  }


  addVideo(videoData: { title: string, videoId: string }): Observable<any> {
    return this.http.post(this.baseUrl, videoData);
  }

  updateVideo(id: number, videoData: { title: string, videoId: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, videoData);
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
