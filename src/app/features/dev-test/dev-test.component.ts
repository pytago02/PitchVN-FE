import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ApiState = 'idle' | 'loading' | 'ready' | 'error';

type TableMeta = {
  name: string;
  primaryKey: string;
};

@Component({
  selector: 'app-dev-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './dev-test.component.html',
  styleUrl: './dev-test.component.css',
})
export class DevTestComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  readonly tabs = [
    { id: 'overview', label: 'Tong quan' },
    { id: 'pitches', label: 'Tim san' },
    { id: 'booking', label: 'Dat lich' },
    { id: 'rankings', label: 'Xep hang' },
    { id: 'feed', label: 'Feed' },
    { id: 'crud', label: 'Du lieu' },
  ];

  activeTab = signal('overview');
  state = signal<ApiState>('idle');
  message = signal('');
  summary = signal<any>(null);
  adminStats = signal<any>(null);
  tables = signal<TableMeta[]>([]);
  tableRows = signal<any[]>([]);
  selectedTable = signal('users');
  selectedTableMeta = computed(() =>
    this.tables().find((table) => table.name === this.selectedTable()),
  );
  teamRankings = signal<any[]>([]);
  playerRankings = signal<any[]>([]);
  feed = signal<any[]>([]);
  pitchResults = signal<any[]>([]);

  pitchSearch = {
    q: '',
    date: '2026-07-01',
    startTime: '17:00',
    endTime: '18:30',
    floorType: '',
    lat: '21.003',
    lng: '105.81',
    radiusKm: '15',
  };

  bookingForm = {
    sub_pitch_id: 1,
    booker_id: 4,
    guest_name: '',
    guest_phone: '',
    booking_date: '2026-07-10',
    start_time: '18:00',
    end_time: '19:30',
    price_total: 600000,
    payment_method: 'CASH',
  };

  registerForm = {
    email: '',
    phone_number: '',
    password: '',
    role: 'PLAYER',
    full_name: '',
    nickname: '',
  };

  crudPayload = '{\n  "email": "new.player@pitchvn.local",\n  "phone_number": "0987000000",\n  "password_hash": "demo",\n  "role": "PLAYER"\n}';

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.state.set('loading');
    this.message.set('');

    Promise.all([
      this.get('public/summary'),
      this.get('admin/stats'),
      this.get('tables'),
      this.get('rankings/teams'),
      this.get('rankings/players'),
      this.get('feed'),
    ])
      .then(([summary, adminStats, tables, teams, players, feed]) => {
        this.summary.set(summary);
        this.adminStats.set(adminStats);
        this.tables.set(tables as TableMeta[]);
        this.teamRankings.set(teams as any[]);
        this.playerRankings.set(players as any[]);
        this.feed.set(feed as any[]);
        this.state.set('ready');
        this.loadTable();
        this.searchPitches();
      })
      .catch((error) => this.handleError(error));
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  searchPitches() {
    const params = this.paramsFrom(this.pitchSearch);
    this.http
      .get<any[]>(`${this.apiUrl}/pitches/search`, { params })
      .subscribe({
        next: (rows) => this.pitchResults.set(rows),
        error: (error) => this.handleError(error),
      });
  }

  createBooking() {
    this.http.post(`${this.apiUrl}/bookings`, this.bookingForm).subscribe({
      next: () => {
        this.message.set('Da tao lich dat san va ghi audit log.');
        this.loadInitialData();
      },
      error: (error) => this.handleError(error),
    });
  }

  registerUser() {
    this.http.post(`${this.apiUrl}/auth/register`, this.registerForm).subscribe({
      next: () => {
        this.message.set('Da tao tai khoan moi.');
        this.registerForm = {
          email: '',
          phone_number: '',
          password: '',
          role: 'PLAYER',
          full_name: '',
          nickname: '',
        };
        this.loadInitialData();
      },
      error: (error) => this.handleError(error),
    });
  }

  confirmBooking(id: number) {
    this.updateBookingStatus(id, 'CONFIRMED');
  }

  cancelBooking(id: number) {
    this.updateBookingStatus(id, 'CANCELLED', 'Chu san huy lich tu dashboard');
  }

  loadTable() {
    this.http
      .get<any[]>(`${this.apiUrl}/${this.selectedTable()}?limit=20`)
      .subscribe({
        next: (rows) => this.tableRows.set(rows),
        error: (error) => this.handleError(error),
      });
  }

  createCrudRecord() {
    try {
      const body = JSON.parse(this.crudPayload) as Record<string, unknown>;
      this.http.post(`${this.apiUrl}/${this.selectedTable()}`, body).subscribe({
        next: () => {
          this.message.set(`Da them ban ghi vao ${this.selectedTable()}.`);
          this.loadTable();
        },
        error: (error) => this.handleError(error),
      });
    } catch {
      this.message.set('JSON khong hop le.');
    }
  }

  rowKeys(row: any) {
    return Object.keys(row).slice(0, 8);
  }

  money(value: unknown) {
    return Number(value ?? 0).toLocaleString('vi-VN');
  }

  private updateBookingStatus(id: number, status: string, reason?: string) {
    this.http
      .patch(`${this.apiUrl}/bookings/${id}/status`, {
        status,
        reason,
        user_id: 2,
        user_role: 'PITCH_OWNER',
      })
      .subscribe({
        next: () => {
          this.message.set(`Da cap nhat booking #${id}.`);
          this.loadInitialData();
        },
        error: (error) => this.handleError(error),
      });
  }

  private get(path: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/${path}`).subscribe({
        next: resolve,
        error: reject,
      });
    });
  }

  private paramsFrom(source: Record<string, unknown>) {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(source)) {
      if (value !== '' && value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    }

    return params;
  }

  private handleError(error: any) {
    this.state.set('error');
    this.message.set(
      error?.error?.message ??
        error?.message ??
        'Khong the ket noi API. Hay chay backend o port 3000.',
    );
  }
}
