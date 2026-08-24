import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Standalone Modules
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { PopoverModule } from 'primeng/popover';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { Post } from '../feed/mock-feed-data';

import { 
  MOCK_PROFILE, 
  MOCK_PROFILE_POSTS, 
  MOCK_ACHIEVEMENTS, 
  PlayerProfile, 
  ProfileAchievement 
} from './mock-profile.data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DialogModule, Select, InputTextModule, 
    ChartModule, PopoverModule, AvatarModule, PostCardComponent, DrawerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // ── States (Signals) ──────────────────────────────────────
  profile = signal<PlayerProfile>(MOCK_PROFILE);
  posts = signal<Post[]>(MOCK_PROFILE_POSTS);
  achievements = signal<ProfileAchievement[]>(MOCK_ACHIEVEMENTS);
  
  activeTab = signal<'posts' | 'stats'>('posts');
  showEditDialog = signal<boolean>(false);
  isDarkMode = false;
  isDrawerOpen = false;
  
  chartPlugins = [ChartDataLabels];

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

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
  toggleLike(post: Post) {
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

  toggleRepost(post: Post) {
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

  // ── PrimeNG Chart Helpers ─────────────────────────────────
  getChartData(history: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--brand-primary').trim() || '#22c55e';
    const primaryColorLight = primaryColor + '30';

    return {
      labels: ['Trận -9', 'Trận -8', 'Trận -7', 'Trận -6', 'Trận -5', 'Trận -4', 'Trận -3', 'Trận -2', 'Trận -1', 'Hiện tại'],
      datasets: [
        {
          label: 'Điểm ELO',
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
    const minElo = Math.min(...history) || 1000;
    const maxElo = Math.max(...history) || 1500;
    const offset = (maxElo - minElo) * 0.1; // Add some padding

    return {
      maintainAspectRatio: false,
      aspectRatio: 3.6,
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
              return 'ELO: ' + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          suggestedMin: Math.max(0, minElo - offset),
          suggestedMax: maxElo + offset,
          display: false
        }
      }
    };
  }
}
