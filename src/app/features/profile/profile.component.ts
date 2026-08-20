import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Standalone Modules
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { 
  MOCK_PROFILE, 
  MOCK_PROFILE_POSTS, 
  MOCK_ACHIEVEMENTS, 
  PlayerProfile, 
  ProfilePost, 
  ProfileAchievement 
} from './mock-profile.data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, Select, InputTextModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // ── States (Signals) ──────────────────────────────────────
  profile = signal<PlayerProfile>(MOCK_PROFILE);
  posts = signal<ProfilePost[]>(MOCK_PROFILE_POSTS);
  achievements = signal<ProfileAchievement[]>(MOCK_ACHIEVEMENTS);
  
  activeTab = signal<'posts' | 'stats'>('posts');
  showEditDialog = signal<boolean>(false);

  // ── Form Model Fields ─────────────────────────────────────
  editName = '';
  editBio = '';
  editPosition: PlayerProfile['preferredPosition'] = 'Tiền đạo';
  editFoot: PlayerProfile['preferredFoot'] = 'Phải';
  editIsPrivate = false;
  editFb = '';
  editInsta = '';
  editZalo = '';

  // ── Dropdown Select Options ───────────────────────────────
  positionOptions: PlayerProfile['preferredPosition'][] = [
    'Thủ môn', 'Hậu vệ', 'Tiền vệ', 'Tiền đạo', 'Linh hoạt'
  ];
  footOptions: PlayerProfile['preferredFoot'][] = [
    'Trái', 'Phải', 'Hai chân'
  ];
  privacyOptions = [
    { label: 'Công khai (Mọi người có thể xem)', value: false },
    { label: 'Riêng tư (Chỉ người theo dõi)', value: true }
  ];

  // ── Social Media & Action Handlers ────────────────────────
  toggleLike(post: ProfilePost) {
    this.posts.update(prev => 
      prev.map(p => {
        if (p.id === post.id) {
          const isLikedNow = !p.isLiked;
          return {
            ...p,
            isLiked: isLikedNow,
            likes: isLikedNow ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  }

  toggleRepost(post: ProfilePost) {
    this.posts.update(prev => 
      prev.map(p => {
        if (p.id === post.id) {
          const isRepostedNow = !p.isReposted;
          return {
            ...p,
            isReposted: isRepostedNow,
            reposts: isRepostedNow ? p.reposts + 1 : p.reposts - 1
          };
        }
        return p;
      })
    );
  }

  // ── Dialog Handlers ───────────────────────────────────────
  openEditDialog() {
    const current = this.profile();
    
    // Populate form fields
    this.editName = current.name;
    this.editBio = current.bio;
    this.editPosition = current.preferredPosition;
    this.editFoot = current.preferredFoot;
    this.editIsPrivate = current.isPrivate;
    this.editFb = current.socialLinks.facebook || '';
    this.editInsta = current.socialLinks.instagram || '';
    this.editZalo = current.socialLinks.zalo || '';
    
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(false);
  }

  saveProfileChanges() {
    // Optimistic Update
    this.profile.update(current => ({
      ...current,
      name: this.editName,
      bio: this.editBio,
      preferredPosition: this.editPosition,
      preferredFoot: this.editFoot,
      isPrivate: this.editIsPrivate,
      socialLinks: {
        facebook: this.editFb || undefined,
        instagram: this.editInsta || undefined,
        zalo: this.editZalo || undefined
      }
    }));

    this.closeEditDialog();
  }

  // ── SVG ELO Chart Calculations ───────────────────────────
  getEloPoints(history: number[]): { x: number; y: number; value: number }[] {
    if (!history || history.length === 0) return [];

    const minElo = Math.min(...history);
    const maxElo = Math.max(...history);
    
    const chartWidth = 580;
    const chartHeight = 160;
    const paddingX = 30;
    const paddingY = 20;

    const widthSpan = chartWidth - 2 * paddingX;
    const heightSpan = chartHeight - 2 * paddingY;
    const numPoints = history.length;

    return history.map((elo, index) => {
      // Space out points evenly along X axis
      const x = paddingX + index * (widthSpan / (numPoints - 1));
      
      let y = paddingY + heightSpan / 2; // Default horizontal center line
      
      if (maxElo !== minElo) {
        // High ELO score goes to top (paddingY)
        // Low ELO score goes to bottom (paddingY + heightSpan)
        const ratio = (elo - minElo) / (maxElo - minElo);
        y = paddingY + (1 - ratio) * heightSpan;
      }
      
      return { x, y, value: elo };
    });
  }

  getEloLinePath(history: number[]): string {
    const points = this.getEloPoints(history);
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  getEloAreaPath(history: number[]): string {
    const points = this.getEloPoints(history);
    if (points.length === 0) return '';
    
    const linePath = this.getEloLinePath(history);
    const chartHeight = 160;
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;

    return `${linePath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
  }
}
