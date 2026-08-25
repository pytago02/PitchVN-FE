import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TournamentTeam } from '../../models/tournamentteam.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentTeamService {
  private baseUrl = `${environment.apiUrl}/TournamentTeams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TournamentTeam[]> {
    return this.http.get<TournamentTeam[]>(this.baseUrl);
  }

  getById(id: string): Observable<TournamentTeam> {
    return this.http.get<TournamentTeam>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<TournamentTeam>): Observable<TournamentTeam> {
    return this.http.post<TournamentTeam>(this.baseUrl, data);
  }

  update(id: string, data: Partial<TournamentTeam>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
