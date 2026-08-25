import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MOCK_PLAYERS,
  MOCK_TEAMS,
  MOCK_PROVINCES,
  RANK_TIERS,
  RankingItem
} from './mock-ranking.data';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PlayerProfileService } from '../../services/playerprofile/playerprofile.service';
import { TeamService } from '../../services/team/team.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, InputTextModule, ChartModule, SkeletonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  // ── States (Signals) ──────────────────────────────────────
  allPlayers = signal<RankingItem[]>([]);
  allTeams = signal<RankingItem[]>([]);
  isLoading = signal<boolean>(true);
  activeTab = signal<'players' | 'teams'>('players');
  searchTerm = signal<string>('');
  selectedProvince = signal<string>('Toàn quốc');
  selectedPeriod = signal<string>('all');
  selectedTier = signal<string>('all');
  expandedRowId = signal<string | null>(null);

  chartPlugins = [ChartDataLabels];

  // ── Static Metadata ──────────────────────────────────────
  provincesOptions = MOCK_PROVINCES.map(p => ({
    label: p === 'Toàn quốc' ? 'Khu vực: Toàn quốc' : p,
    value: p
  }));
  rankTiers = RANK_TIERS;
  periods = [
    { value: 'all', label: 'Thời gian: Tất cả' },
    { value: 'week', label: 'Thời gian: Tuần này' },
    { value: 'month', label: 'Thời gian: Tháng này' },
    { value: 'year', label: 'Thời gian: Năm này' }
  ];

  constructor(private playerService: PlayerProfileService, private teamService: TeamService) { }

  ngOnInit() {
    this.isLoading.set(true);
    this.playerService.getAll().subscribe({
      next: (players: any[]) => {
        const mappedPlayers: RankingItem[] = players.map(p => ({
          id: p['id'] || '',
          rank: 1,
          name: p['username'] || p['preferredPosition'] || 'Player',
          avatar: p['avatar'] || 'https://i.pravatar.cc/150',
          matches: 10,
          won: 5,
          drawn: 2,
          lost: 3,
          goalsFor: 15,
          goalsAgainst: 10,
          goalDifference: 5,
          elo: p['eloScore'] || 1000,
          rankTier: 'B' as any,
          province: p['address'] || 'Hà Nội',
          trend: 'stable' as any,
          rankHistory: [1, 2, 1, 1, 1, 1],
          winRate: 50
        }));
        mappedPlayers.sort((a, b) => b.elo - a.elo);
        mappedPlayers.forEach((p, i) => { p.rank = i + 1; });
        this.allPlayers.set(mappedPlayers);

        this.teamService.getAll().subscribe({
          next: (teams: any[]) => {
            const mappedTeams: RankingItem[] = teams.map(t => ({
              id: t['id'] || '',
              rank: 1,
              name: t['name'] || 'Team',
              avatar: t['logo'] || 'https://i.pravatar.cc/150',
              matches: 10,
              won: 5,
              drawn: 2,
              lost: 3,
              goalsFor: 15,
              goalsAgainst: 10,
              goalDifference: 5,
              elo: t['eloScore'] || 1000,
              rankTier: 'B' as any,
              province: t['homeArea'] || 'Hà Nội',
              trend: 'up' as any,
              rankHistory: [1, 2, 1, 1, 1, 1],
              winRate: 50
            }));
            mappedTeams.sort((a, b) => b.elo - a.elo);
            mappedTeams.forEach((t, i) => { t.rank = i + 1; });
            this.allTeams.set(mappedTeams);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }

  // ── Computed Filtered Data ───────────────────────────────
  filteredData = computed<RankingItem[]>(() => {
    const tab = this.activeTab();
    const search = this.searchTerm().trim().toLowerCase();
    const province = this.selectedProvince();
    const tier = this.selectedTier();

    // Select source data
    const rawData = tab === 'players' ? this.allPlayers() : this.allTeams();

    // Apply filtering
    return rawData.filter(item => {
      const matchSearch = !search || item.name.toLowerCase().includes(search);
      const matchProvince = province === 'Toàn quốc' || item.province === province;
      const matchTier = tier === 'all' || item.rankTier === tier;

      return matchSearch && matchProvince && matchTier;
    });
  });

  // ── Action Handlers ──────────────────────────────────────
  setActiveTab(tab: 'players' | 'teams') {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
    this.expandedRowId.set(null); // Reset expanded details
    this.selectedTier.set('all'); // Reset tier filter
  }

  toggleRow(id: string) {
    if (this.expandedRowId() === id) {
      this.expandedRowId.set(null);
    } else {
      this.expandedRowId.set(id);
    }
  }

  // ── PrimeNG Chart Helpers ─────────────────────────────────
  getChartData(history: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--brand-primary').trim() || '#22c55e';
    const primaryColorLight = primaryColor + '30'; // adding some opacity for fill

    return {
      labels: ['Tuần -5', 'Tuần -4', 'Tuần -3', 'Tuần -2', 'Tuần -1', 'Hiện tại'],
      datasets: [
        {
          label: 'Thứ hạng',
          data: history,
          fill: true,
          borderColor: primaryColor,
          backgroundColor: primaryColorLight,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: documentStyle.getPropertyValue('--surface-bg').trim() || '#ffffff',
          pointBorderColor: primaryColor,
          pointBorderWidth: 2
        }
      ]
    };
  }

  getChartOptions(history: number[]): any {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary').trim() || '#1f2937';
    const textColorSecondary = documentStyle.getPropertyValue('--text-tertiary').trim() || '#6b7280';
    const surfaceBorder = documentStyle.getPropertyValue('--border-color').trim() || '#e5e7eb';

    const minRank = Math.min(...history) || 1;
    const maxRank = Math.max(...history) || 100;

    return {
      maintainAspectRatio: false,
      aspectRatio: 3,
      layout: {
        padding: {
          top: 20
        }
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: () => getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#1f2937',
          font: {
            weight: 'bold',
            size: 11
          },
          formatter: (value: any) => value
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return 'Thứ hạng: #' + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          reverse: true, // Best rank is at top
          suggestedMin: minRank,
          suggestedMax: maxRank,
          display: false
        }
      }
    };
  }
}
