import { Component, computed, signal } from '@angular/core';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, InputTextModule, ChartModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  // ── States (Signals) ──────────────────────────────────────
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

  // ── Computed Filtered Data ───────────────────────────────
  filteredData = computed<RankingItem[]>(() => {
    const tab = this.activeTab();
    const search = this.searchTerm().trim().toLowerCase();
    const province = this.selectedProvince();
    const tier = this.selectedTier();

    // Select source data
    const rawData = tab === 'players' ? MOCK_PLAYERS : MOCK_TEAMS;

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
