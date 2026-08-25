import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tournament } from '../../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private baseUrl = `${environment.apiUrl}/Tournaments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.baseUrl);
  }

  getById(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Tournament>): Observable<Tournament> {
    return this.http.post<Tournament>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Tournament>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
