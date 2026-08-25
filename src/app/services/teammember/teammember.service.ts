import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeamMember } from '../../models/teammember.model';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private baseUrl = `${environment.apiUrl}/TeamMembers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(this.baseUrl);
  }

  getById(id: string): Observable<TeamMember> {
    return this.http.get<TeamMember>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<TeamMember>): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.baseUrl, data);
  }

  update(id: string, data: Partial<TeamMember>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
