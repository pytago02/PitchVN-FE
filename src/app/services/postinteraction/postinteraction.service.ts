import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PostInteraction } from '../../models/postinteraction.model';

@Injectable({
  providedIn: 'root'
})
export class PostInteractionService {
  private baseUrl = `${environment.apiUrl}/PostInteractions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PostInteraction[]> {
    return this.http.get<PostInteraction[]>(this.baseUrl);
  }

  getById(id: string): Observable<PostInteraction> {
    return this.http.get<PostInteraction>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<PostInteraction>): Observable<PostInteraction> {
    return this.http.post<PostInteraction>(this.baseUrl, data);
  }

  update(id: string, data: Partial<PostInteraction>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
