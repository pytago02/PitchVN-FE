import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MasterData {
  id: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPositions(): Observable<MasterData[]> {
    return this.http.get<MasterData[]>(`${this.apiUrl}/positions`);
  }

  getFoots(): Observable<MasterData[]> {
    return this.http.get<MasterData[]>(`${this.apiUrl}/foots`);
  }

  getRanks(): Observable<MasterData[]> {
    return this.http.get<MasterData[]>(`${this.apiUrl}/ranks`);
  }

  getPitchTypes(): Observable<MasterData[]> {
    return this.http.get<MasterData[]>(`${this.apiUrl}/pitchtypes`);
  }

  getFacilities(): Observable<MasterData[]> {
    return this.http.get<MasterData[]>(`${this.apiUrl}/facilities`);
  }
}
