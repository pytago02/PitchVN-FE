import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pitch } from '../../models/pitch.model';

@Injectable({
  providedIn: 'root'
})
export class PitchService {
  private baseUrl = `${environment.apiUrl}/Pitches`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pitch[]> {
    return this.http.get<Pitch[]>(this.baseUrl);
  }

  getById(id: string): Observable<Pitch> {
    return this.http.get<Pitch>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Pitch>): Observable<Pitch> {
    return this.http.post<Pitch>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Pitch>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
