import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Team, RankInfo, RANK_TIERS } from '../../../features/challenge-finder/mock-challenge-data';

@Component({
  selector: 'app-team-detail-popup',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './team-detail-popup.component.html',
  styleUrls: ['./team-detail-popup.component.css']
})
export class TeamDetailPopupComponent {
  @Input() visible: boolean = false;
  @Input() team: Team | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() challenge = new EventEmitter<void>();

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getRankInfo(tier: string): RankInfo {
    return RANK_TIERS[tier as keyof typeof RANK_TIERS] || RANK_TIERS['F'];
  }

  onChallenge() {
    this.closeModal();
    this.challenge.emit();
  }
}
