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

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, InputTextModule],
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

  // ── SVG Sparkline Chart Helpers ──────────────────────────
  /**
   * Calculate coordinates for SVG ranking history path.
   * Ranking position 1 is best, so it maps to top of Y axis.
   */
  getPoints(history: number[]): { x: number; y: number; value: number }[] {
    if (!history || history.length === 0) return [];
    
    const minRank = Math.min(...history);
    const maxRank = Math.max(...history);
    const chartWidth = 320;
    const chartHeight = 120;
    const paddingX = 20;
    const paddingY = 20;

    const widthSpan = chartWidth - 2 * paddingX;
    const heightSpan = chartHeight - 2 * paddingY;
    const numPoints = history.length;

    return history.map((rank, index) => {
      // Divide X axis evenly
      const x = paddingX + index * (widthSpan / (numPoints - 1));
      
      let y = paddingY + heightSpan / 2; // Default horizontal center line
      
      if (maxRank !== minRank) {
        // Map rank to Y-axis. 
        // Best rank (minRank) goes to top (paddingY)
        // Worst rank (maxRank) goes to bottom (paddingY + heightSpan)
        const ratio = (rank - minRank) / (maxRank - minRank);
        y = paddingY + ratio * heightSpan;
      }
      
      return { x, y, value: rank };
    });
  }

  getSvgLinePath(history: number[]): string {
    const points = this.getPoints(history);
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  getSvgAreaPath(history: number[]): string {
    const points = this.getPoints(history);
    if (points.length === 0) return '';
    
    const linePath = this.getSvgLinePath(history);
    const chartHeight = 120;
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;

    // Connect line to bottom right and bottom left to close the area path
    return `${linePath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
  }
}
