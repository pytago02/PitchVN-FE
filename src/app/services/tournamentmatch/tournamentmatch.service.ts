import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TournamentMatch } from '../../models/tournamentmatch.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentMatchService {
  private baseUrl = `${environment.apiUrl}/TournamentMatches`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TournamentMatch[]> {
    return this.http.get<TournamentMatch[]>(this.baseUrl);
  }

  getById(id: string): Observable<TournamentMatch> {
    return this.http.get<TournamentMatch>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<TournamentMatch>): Observable<TournamentMatch> {
    return this.http.post<TournamentMatch>(this.baseUrl, data);
  }

  update(id: string, data: Partial<TournamentMatch>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
