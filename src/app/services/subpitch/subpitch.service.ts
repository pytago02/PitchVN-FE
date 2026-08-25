import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubPitch } from '../../models/subpitch.model';

@Injectable({
  providedIn: 'root'
})
export class SubPitchService {
  private baseUrl = `${environment.apiUrl}/SubPitches`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubPitch[]> {
    return this.http.get<SubPitch[]>(this.baseUrl);
  }

  getById(id: string): Observable<SubPitch> {
    return this.http.get<SubPitch>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<SubPitch>): Observable<SubPitch> {
    return this.http.post<SubPitch>(this.baseUrl, data);
  }

  update(id: string, data: Partial<SubPitch>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
