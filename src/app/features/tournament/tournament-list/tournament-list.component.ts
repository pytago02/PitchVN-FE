import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MOCK_TOURNAMENTS, Tournament, TournamentStatus } from '../mock-tournament-data';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    TagModule,
    TabsModule
  ],
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.css'
})
export class TournamentListComponent {
  tournaments = signal<Tournament[]>(MOCK_TOURNAMENTS);

  viewModes = [
    { icon: 'pi pi-th-large', value: 'grid', label: 'Lưới' },
    { icon: 'pi pi-list', value: 'list', label: 'Danh sách' }
  ];
  currentViewMode = signal<'grid' | 'list'>('grid');

  statusFilters = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Sắp diễn ra', value: 'upcoming' },
    { label: 'Đang diễn ra', value: 'ongoing' },
    { label: 'Đã kết thúc', value: 'completed' }
  ];
  currentStatus = signal<string>('all');

  updateStatus(status: string | number | undefined) {
    if (typeof status === 'string') {
      this.currentStatus.set(status);
    }
  }

  filteredTournaments = computed(() => {
    const status = this.currentStatus();
    if (status === 'all') {
      return this.tournaments();
    }
    return this.tournaments().filter(t => t.status === status);
  });

  getStatusLabel(status: TournamentStatus): string {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return '';
    }
  }

  getStatusSeverity(status: TournamentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'success';
      case 'completed': return 'secondary';
      default: return 'info';
    }
  }
}
