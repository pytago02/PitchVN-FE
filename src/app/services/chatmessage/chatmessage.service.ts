import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../../models/chatmessage.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private baseUrl = `${environment.apiUrl}/ChatMessages`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.baseUrl);
  }

  getById(id: string): Observable<ChatMessage> {
    return this.http.get<ChatMessage>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.baseUrl, data);
  }

  update(id: string, data: Partial<ChatMessage>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
