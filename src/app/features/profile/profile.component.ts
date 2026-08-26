import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';

// PrimeNG Standalone Modules
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { PopoverModule } from 'primeng/popover';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MasterDataService } from '../../services/master-data/master-data.service';
import { PlayerProfileService } from '../../services/playerprofile/playerprofile.service';
import { ProvinceService, Province } from '../../services/provinces/province-service';

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
    CommonModule, FormsModule, DialogModule, Select, MultiSelectModule, InputTextModule,
    ChartModule, PopoverModule, AvatarModule, PostCardComponent, DrawerModule, SkeletonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // â”€â”€ States (Signals) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  isOwner = false;
  profile = signal<PlayerProfile | null>(null);
  posts = signal<Post[]>(MOCK_PROFILE_POSTS);
  achievements = signal<ProfileAchievement[]>(MOCK_ACHIEVEMENTS);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');
  provinces = signal<Province[]>([]);
  districts = signal<any[]>([]);

  activeTab = signal<'posts' | 'stats'>('posts');
  showEditDialog = signal<boolean>(false);
  isDrawerOpen = false;

  chartPlugins = [ChartDataLabels];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerProfileService: PlayerProfileService,
    private location: Location,
    private titleService: Title,
    public themeService: ThemeService,
    public authService: AuthService,
    private masterDataService: MasterDataService,
    private provinceService: ProvinceService
  ) { }

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.masterDataService.getPositions().subscribe(data => this.positionOptions = data);
    this.masterDataService.getFoots().subscribe(data => this.footOptions = data);

    this.provinceService.showAllDivisions('v1', 2).subscribe({
      next: (data) => {
        this.provinces.set(data);
      }
    });

    this.isLoading.set(true);
    this.playerProfileService.getByUserId(user.id).subscribe({
      next: (p: any) => {
        if (p) {
          const mappedProfile: PlayerProfile = {
            id: p.id || '',
            name: p.name || user.name || (user as any).username || 'NgÆ°á»i dÃ¹ng má»›i',
            handle: p.name ? p.name.toLowerCase().replace(/\s/g, '') : 'user',
            avatar: p.avatar || 'https://i.pravatar.cc/150',
            coverPhoto: p.coverPhoto || 'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80&w=1000',
            bio: p.bio || 'ChÆ°a cÃ³ tiá»ƒu sá»­',
            followersCount: p.followersCount || 0,
            followingCount: p.followingCount || 0,
            preferredPosition: p.preferredPosition || 'Linh hoáº¡t',
            preferredFoot: p.preferredFoot || 'Hai chÃ¢n',
            isPrivate: p.isPrivate || false,
            province: p.provinceId ? p.provinceId : (p.province || 'Hà Nội'),
            socialLinks: (typeof p.socialLinks === 'string') ? JSON.parse(p.socialLinks) : (p.socialLinks || {}),
            stats: {
              matches: p.matchesPlayed || 0,
              won: p.matchesWon || 0,
              drawn: 0,
              lost: (p.matchesPlayed || 0) - (p.matchesWon || 0),
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0,
              elo: p.eloScore || 1000,
              rankTier: p.rankTier || 'C',
              winRate: p.matchesPlayed ? Math.round(((p.matchesWon || 0) / p.matchesPlayed) * 100) : 0
            },
            eloHistory: [1000, 1005, 1010, 995, 1005, p.eloScore || 1000]
          };
          this.profile.set(mappedProfile);
        } else {
          this.router.navigate(['/setup-profile']);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/setup-profile']);
        this.isLoading.set(false);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // â”€â”€ Form Model Fields â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  editName = '';
  editBio = '';
  editPosition: string[] = [];
  editFoot: PlayerProfile['preferredFoot'] = 'Hai chÃ¢n';
  editIsPrivate = false;
  editFb = '';
  editInsta = '';
  editZalo = '';
  editProvinceObj: any = null;
  editDistrictObj: any = null;

  getDisplayPosition(): string {
    const pos = this.profile()?.preferredPosition;
    if (Array.isArray(pos)) return pos.join(', ');
    return typeof pos === 'string' ? pos : 'ChÆ°a cáº­p nháº­t';
  }

  // â”€â”€ Dropdown Select Options â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  positionOptions: any[] = [];

  footOptions: any[] = [];
  privacyOptions = [
    { label: 'CÃ´ng khai (Má»i ngÆ°á»i cÃ³ thá»ƒ xem)', value: false },
    { label: 'RiÃªng tÆ° (Chá»‰ ngÆ°á»i theo dÃµi)', value: true }
  ];

  // â”€â”€ Social Media & Action Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Dialog Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  openEditDialog() {
    const current = this.profile();
    if (!current) return;
    this.editName = current.name || '';
    this.editBio = current.bio || '';
    this.editPosition = Array.isArray(current.preferredPosition) ? current.preferredPosition : (current.preferredPosition ? current.preferredPosition.split(',').map(s => s.trim()) : []);
    this.editFoot = current.preferredFoot || 'Hai chÃ¢n';
    this.editIsPrivate = current.isPrivate || false;
    this.editFb = current.socialLinks.facebook || '';
    this.editInsta = current.socialLinks.instagram || '';
    this.editZalo = current.socialLinks.zalo || '';
    
    // Parse the province string to prefill the dropdowns
    const provStr = current.province || 'HÃ  Ná»™i';
    const parts = provStr.split(',').map(p => p.trim());
    const provinceName = parts.length > 1 ? parts[1] : parts[0];
    const districtName = parts.length > 1 ? parts[0] : null;

    const matchedProv = this.provinces().find(p => p.name === provinceName) || this.provinces()[0];
    this.editProvinceObj = matchedProv || null;
    this.districts.set(matchedProv?.districts || []);
    
    if (districtName && this.editProvinceObj) {
      this.editDistrictObj = this.editProvinceObj.districts?.find((d: any) => d.name === districtName) || null;
    } else {
      this.editDistrictObj = null;
    }

    this.showEditDialog.set(true);
  }

  onEditProvinceChange() {
    this.editDistrictObj = null;
    this.districts.set(this.editProvinceObj?.districts || []);
  }

  closeEditDialog() {
    this.showEditDialog.set(false);
  }

  saveProfileChanges() {
    const current = this.profile();
    if (!current) {
      this.closeEditDialog();
      return;
    }
    
    this.isLoading.set(true);
    
    const socialLinksJson = JSON.stringify({
      facebook: this.editFb || undefined,
      instagram: this.editInsta || undefined,
      zalo: this.editZalo || undefined
    });

    const finalProvinceStr = this.editDistrictObj 
      ? `${this.editDistrictObj.name}, ${this.editProvinceObj?.name}`
      : (this.editProvinceObj?.name || 'HÃ  Ná»™i');

    const updateData = {
      name: this.editName,
      bio: this.editBio,
      positionIds: this.editPosition,
      footId: this.editFoot,
      isPrivate: this.editIsPrivate,
      province: finalProvinceStr,
      socialLinks: socialLinksJson
    };

    this.playerProfileService.update(current.id, updateData).subscribe({
      next: () => {
        this.profile.update(c => {
          if (!c) return c;
          return {
            ...c,
            name: this.editName,
            bio: this.editBio,
            positionIds: this.editPosition,
            footId: this.editFoot,
            isPrivate: this.editIsPrivate,
            province: finalProvinceStr,
            socialLinks: {
              facebook: this.editFb || undefined,
              instagram: this.editInsta || undefined,
              zalo: this.editZalo || undefined
            }
          };
        });
        this.isLoading.set(false);
        this.closeEditDialog();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Lá»—i khi cáº­p nháº­t profile', err);
        // Show some toast or error message in real app
        this.closeEditDialog();
      }
    });
  }

  // â”€â”€ PrimeNG Chart Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  getChartData(history: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--brand-primary').trim() || '#22c55e';
    const primaryColorLight = primaryColor + '30';

    return {
      labels: ['Tráº­n -9', 'Tráº­n -8', 'Tráº­n -7', 'Tráº­n -6', 'Tráº­n -5', 'Tráº­n -4', 'Tráº­n -3', 'Tráº­n -2', 'Tráº­n -1', 'Hiá»‡n táº¡i'],
      datasets: [
        {
          label: 'Äiá»ƒm ELO',
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

