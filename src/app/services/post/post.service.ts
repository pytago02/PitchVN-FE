import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = `${environment.apiUrl}/Posts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Post>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  likePost(id: string): Observable<{message: string, isLiked: boolean}> {
    return this.http.post<{message: string, isLiked: boolean}>(`${this.baseUrl}/${id}/like`, {});
  }

  unlikePost(id: string): Observable<{message: string, isLiked: boolean}> {
    return this.http.post<{message: string, isLiked: boolean}>(`${this.baseUrl}/${id}/unlike`, {});
  }

  isLiked(id: string): Observable<{isLiked: boolean}> {
    return this.http.get<{isLiked: boolean}>(`${this.baseUrl}/${id}/liked`);
  }

  commentPost(id: string, data: { userId: string, content: string, replyToId?: string }): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.baseUrl}/${id}/comment`, data);
  }

  repostPost(id: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.baseUrl}/${id}/repost`, {});
  }

  sharePost(id: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.baseUrl}/${id}/share`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
