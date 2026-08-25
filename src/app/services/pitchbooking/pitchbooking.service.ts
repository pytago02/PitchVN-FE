import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PitchBooking } from '../../models/pitchbooking.model';

@Injectable({
  providedIn: 'root'
})
export class PitchBookingService {
  private baseUrl = `${environment.apiUrl}/PitchBookings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PitchBooking[]> {
    return this.http.get<PitchBooking[]>(this.baseUrl);
  }

  getById(id: string): Observable<PitchBooking> {
    return this.http.get<PitchBooking>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<PitchBooking>): Observable<PitchBooking> {
    return this.http.post<PitchBooking>(this.baseUrl, data);
  }

  update(id: string, data: Partial<PitchBooking>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
