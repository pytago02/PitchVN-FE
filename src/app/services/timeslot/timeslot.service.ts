import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TimeSlot } from '../../models/timeslot.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private baseUrl = `${environment.apiUrl}/TimeSlots`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(this.baseUrl);
  }

  getById(id: string): Observable<TimeSlot> {
    return this.http.get<TimeSlot>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<TimeSlot>): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(this.baseUrl, data);
  }

  update(id: string, data: Partial<TimeSlot>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
