import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MOCK_TOURNAMENTS, Tournament, TournamentStatus } from '../mock-tournament-data';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { SkeletonModule } from 'primeng/skeleton';

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
    TabsModule,
    SkeletonModule
  ],
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.css'
})
export class TournamentListComponent implements OnInit {
  tournaments = signal<Tournament[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private tournamentService: TournamentService) {}

  ngOnInit(): void {
    this.isLoading.set(true);
    this.tournamentService.getAll().subscribe({
      next: (data) => {
        const mappedData: Tournament[] = data.map(t => {
          let prizePool = 0;
          let entryFee = 0;
          try {
            if (t['prizePool']) {
              const pp = typeof t['prizePool'] === 'string' ? JSON.parse(t['prizePool']) : t['prizePool'];
              prizePool = pp.champion || pp.total || 0;
            }
          } catch(e){}
          
          return {
            id: t['id'] || '',
            name: t['name'] || 'Unknown',
            thumbnail: t['coverImage'] || 'https://images.unsplash.com/photo-1518605368461-1ee11c5211b6?auto=format&fit=crop&q=80&w=800',
            description: t['description'] ? t['description'].substring(0, 100) + '...' : '',
            status: t['status'] as any || 'upcoming',
            format: t['format'] as any || 'vong_bang',
            minRank: 'ALL',
            fee: entryFee,
            prize: prizePool.toString(),
            startDate: t['startDate'] ? new Date(t['startDate']).toISOString() : new Date().toISOString(),
            endDate: t['endDate'] ? new Date(t['endDate']).toISOString() : new Date().toISOString(),
            organizer: {
              id: t['organizerId'] || '1',
              name: 'Admin',
              avatar: 'https://i.pravatar.cc/150'
            },
            registeredTeams: 0,
            maxTeams: t['maxTeams'] || 16,
            location: t['location'] || ''
          };
        });
        this.tournaments.set(mappedData);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

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
