import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerProfile } from '../../models/playerprofile.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerProfileService {
  private baseUrl = `${environment.apiUrl}/PlayerProfiles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlayerProfile[]> {
    return this.http.get<PlayerProfile[]>(this.baseUrl);
  }

  getById(id: string): Observable<PlayerProfile> {
    return this.http.get<PlayerProfile>(`${this.baseUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<PlayerProfile> {
    return this.http.get<PlayerProfile>(`${this.baseUrl}/user/${userId}`);
  }

  create(data: Partial<PlayerProfile>): Observable<PlayerProfile> {
    return this.http.post<PlayerProfile>(this.baseUrl, data);
  }

  update(id: string, data: Partial<PlayerProfile>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
