import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Challenge } from '../../models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private baseUrl = `${environment.apiUrl}/Challenges`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseUrl);
  }

  getById(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Challenge>): Observable<Challenge> {
    return this.http.post<Challenge>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Challenge>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
