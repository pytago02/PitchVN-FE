import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';

import {
  MOCK_CHALLENGES,
  MOCK_TEAMS,
  MY_TEAM,
  MOCK_CHATS,
  RANK_TIERS,
  Challenge,
  Team,
  ChatMessage,
  RankTier,
  RankInfo,
  IndividualSubtype,
} from './mock-challenge-data';
import { Pitch, MOCK_PITCHES } from '../pitch-finder/mock-pitch-data';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProvinceService } from '../../services/provinces/province-service';
import { TeamDetailPopupComponent } from '../../shared/components/team-detail-popup/team-detail-popup.component';
import { PitchDetailPopupComponent } from '../../shared/components/pitch-detail-popup/pitch-detail-popup.component';
import { ChallengeService } from '../../services/challenge/challenge.service';
@Component({
  selector: 'app-challenge-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, SkeletonModule, ToastModule, SharedModule, DatePickerModule, TextareaModule, InputNumberModule, TeamDetailPopupComponent, PitchDetailPopupComponent, Select, CheckboxModule],
  providers: [MessageService],
  templateUrl: './challenge-finder.component.html',
  styleUrls: ['./challenge-finder.component.css'],
})
export class ChallengeFinderComponent implements OnInit {
  // ── Data Sources ──────────────────────────────────────────
  allChallenges: Challenge[] = [];
  isLoading = true;
  filteredChallenges: Challenge[] = [];
  myTeam: Team = MY_TEAM;
  rankTiers = RANK_TIERS;
  allRanks: RankTier[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];

  // Type match
  matchFormat = [
    { label: 'Sân 5 người', value: '5v5' },
    { label: 'Sân 7 người', value: '7v7' },
    { label: 'Sân 11 người', value: '11v11' },
  ];
  selectedMatchFormat = this.matchFormat[0];

  // ── Filters State ───────────────────────────────────────────────────────────
  showFilters: boolean = true;
  activeTab: 'all' | 'team' | 'individual' | 'my' = 'all';
  individualSubFilter: 'all' | 'team_needs_player' | 'player_needs_team' = 'all';
  searchQuery = '';
  selectedRanks: string[] = []; // empty means 'all'
  selectedFormat = 'all'; // 'all' | '5v5' | '7v7' | '11v11'
  selectedFeeSplit = ''; // empty means 'all'
  filterDate: Date | null = null;
  filterTimeFrom: Date | null = null;
  filterTimeTo: Date | null = null;

  // Dữ liệu hành chính Việt Nam lấy từ provinces API
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  selectedProvince: any = null;
  selectedDistrict: any = [];
  selectedWards: any[] = []; // Cho phép chọn nhiều xã phường (PrimeNG MultiSelect)

  // Getter/Setter để tương thích với logic cũ dùng code
  get selectedProvinceCode(): number | null { return this.selectedProvince?.code ?? null; }
  get selectedDistrictCode(): number | null { return this.selectedDistrict?.code ?? null; }
  get selectedWardCodes(): number[] { return this.selectedWards.map(w => w.code); }

  // ── API Version Toggle (Trước / Sau sáp nhập) ──────────────
  apiVersion: 'v1' | 'v2' = 'v1'; // v1 = trước sáp nhập, v2 = sau sáp nhập
  isLoadingProvinces = false;

  selectedRadius = 'all'; // 'all' | '2' | '5' | '10' | '20' | 'custom' (km)
  customRadius: number | null = null; // Bán kính tùy chỉnh
  districtsList = ['Cầu Giấy', 'Thanh Xuân', 'Nam Từ Liêm', 'Đống Đa', 'Ba Đình', 'Hà Đông'];
  radiusList = [
    { label: 'Tất cả', value: 'all' },
    { label: '< 2 km', value: '2' },
    { label: '< 5 km', value: '5' },
    { label: '< 10 km', value: '10' },
    { label: '< 20 km', value: '20' },
  ];
  positionsList = [
    { label: 'Tất cả vị trí', value: 'all' },
    { label: 'Thủ môn (GK)', value: 'GK' },
    { label: 'Hậu vệ (DF)', value: 'DF' },
    { label: 'Tiền vệ (MF)', value: 'MF' },
    { label: 'Tiền đạo (FW)', value: 'FW' },
  ];
  selectedPosition = 'all'; // Dùng cho tab Ghép người đá

  // ── Active Objects for Modals ─────────────────────────────
  selectedChallenge: Challenge | null = null;
  selectedTeam: Team | null = null;
  selectedPitch: Pitch | null = null;
  selectedChat: any | null = null;

  // Modals
  showPitchModal = false;
  selectedPitchName = '';
  selectedPitchAddress = '';
  selectedPitchDistrict = '';
  selectedPitchDistance?: number;

  // ── Modals State ──────────────────────────────────────────
  showCreateDialog = false;
  showTeamModal = false;
  showChatModal = false;
  showMatchConfirmModal = false;
  showSuccessModal = false;

  // ── Create Challenge Form State ───────────────────────────
  postType: 'team' | 'individual' = 'team';
  createIndividualSubtype: IndividualSubtype = 'team_needs_player';
  newNeededSlots = 2;
  newPreferredPosition: string[] = ['Tiền đạo (FW) / Tiền vệ cánh'];
  availablePositions = [
    { name: 'Tiền đạo (FW) / Tiền vệ cánh', code: 'FW' },
    { name: 'Tiền vệ trung tâm (CM/CAM)', code: 'CM' },
    { name: 'Hậu vệ / Trung vệ (CB/LB/RB)', code: 'CB' },
    { name: 'Thủ môn (GK)', code: 'GK' }
  ];
  newTitle = '';
  newFormat: '5v5' | '7v7' | '11v11' = '7v7';
  newDate = new Date();
  minDate = new Date();
  newTimeFrom: Date = (() => { const d = new Date(); d.setHours(19, 0, 0, 0); return d; })();
  newTimeTo: Date = (() => { const d = new Date(); d.setHours(20, 30, 0, 0); return d; })();
  newPitch = 'Sân bóng Chảo Lửa Cầu Giấy';

  newProvinceObj: any = null;
  newDistrictObj: any = null;
  newWards: any[] = [];
  newWardObj: any = null;
  newDistricts: any[] = [];

  newFeeSplit: '50-50' | 'loser-pays' | '60-40' = '50-50';
  newEstimatedPrice = 500000;
  newTargetRanks: RankTier[] = ['A', 'B', 'C'];
  newNote = '';
  newHasPitch = true;
  isSubmitting = false;

  // ── Quick Chat State ──────────────────────────────────────
  chatMessages: ChatMessage[] = [];
  newChatMessage = '';
  quickReplies = [
    'Chào bạn! Bên mình muốn giao lưu khung giờ này.',
    'Bên bạn đã có sân sẵn chưa?',
    'Đội mình nhận kèo 5-5 nhé, chốt lịch luôn!',
    'Mình xin đăng ký 1 slot đá tối nay nhé!',
    'Đội mình chào đón bạn, đến sân đúng giờ nhé!',
  ];

  constructor(
    private messageService: MessageService, 
    private http: HttpClient, 
    private provinceService: ProvinceService, 
    private challengeService: ChallengeService, 
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchProvinces();
    this.fetchData();
  }

  getPositionLabel(): string {
    if (!this.newPreferredPosition || this.newPreferredPosition.length === 0) return 'Chọn vị trí sở trường';
    const first = this.availablePositions.find((p) => p.name === this.newPreferredPosition[0])?.name ?? this.newPreferredPosition[0];
    return this.newPreferredPosition.length > 1 ? `${first} (+${this.newPreferredPosition.length - 1} khác)` : first;
  }

  get allPositionsSelected(): boolean {
    return this.newPreferredPosition && this.newPreferredPosition.length === this.availablePositions.length;
  }

  get indeterminatePositions(): boolean {
    return this.newPreferredPosition && this.newPreferredPosition.length > 0 && !this.allPositionsSelected;
  }

  isPositionSelected(pos: any): boolean {
    return this.newPreferredPosition && this.newPreferredPosition.includes(pos.name);
  }

  onToggleAllPositions(checked: boolean) {
    this.newPreferredPosition = checked ? this.availablePositions.map((p) => p.name) : [];
    this.updateDefaultTitle();
  }

  fetchData() {
    this.isLoading = true;
    this.challengeService.getAll().subscribe({
      next: (data) => {
        if (!Array.isArray(data)) {
           this.allChallenges = [];
           this.applyFilters();
           this.isLoading = false;
           this.cdr.detectChanges();
           return;
        }

        this.allChallenges = data.map(c => {
          if (!c) return null;
          let tr: any = [];
          let np: any = [];
          try { if (c['targetRanks']) tr = typeof c['targetRanks'] === 'string' ? JSON.parse(c['targetRanks']) : c['targetRanks']; } catch(e){}
          try { if (c['neededPositions']) np = typeof c['neededPositions'] === 'string' ? JSON.parse(c['neededPositions']) : c['neededPositions']; } catch(e){}
          
          return {
            id: c.id || '',
            type: c['challengeIndividualSubtypeId'] ? 'individual' : 'team',
            individualSubtype: c['challengeIndividualSubtypeId'] ? 'team_needs_player' : undefined,
            format: c['matchFormat'] || '7v7',
            formatLabel: c['matchFormat'] || 'Sân 7',
            matchDate: c['matchDate'] ? new Date(c['matchDate']) : new Date(),
            matchTime: c['matchTime'] || 'Chưa cập nhật',
            feeSplit: c['feeSplit'] as any || '50-50',
            feeSplitLabel: '50-50',
            estimatedPrice: c['estimatedPrice'] ?? 0,
            hasPitchAlready: c['hasPitchAlready'] ?? !!c['pitchId'],
            status: c['status'] as any || 'open',
            note: c['note'] || '',
            targetRanks: tr.length ? tr : ['A'],
            neededPositions: np,
            title: c['title'] || 'Giao lưu bóng đá',
            pitchName: c['pitch']?.name || (c['pitchId'] ? 'Đang cập nhật sân' : 'Chưa có sân'),
            pitchAddress: c['pitch']?.address || '',
            district: c['district'] || c['pitch']?.district || '',
            pitchId: c['pitchId'],
            pitch: c['pitch'],
            createdAt: c['createdAt'] || new Date().toISOString(),
            applicantsCount: c['applicantsCount'] ?? 0,
            contactPhone: c['phone'] || '0123456789',
            
            // Mocks since these are relations that need to be populated by backend later
            creatorTeam: c['type'] === 'team' ? MOCK_TEAMS[0] : undefined,
            creatorUser: c['type'] === 'individual' ? {
              id: '1',
              name: 'Player',
              avatar: 'https://i.pravatar.cc/150',
              rank: 'B',
              elo: 1000,
              phone: '0123456789'
            } : undefined
          };
        }).filter(Boolean) as Challenge[];
        
        // Mặc định load all
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchProvinces() {
    this.isLoadingProvinces = true;
    this.provinceService.showAllDivisions(this.apiVersion, 3).subscribe({
      next: (data) => {
        this.provinces = data;
        this.isLoadingProvinces = false;
        // Tự động định vị và chọn
        this.autoDetectLocation(data);
      },
      error: (err) => {
        console.error('Lỗi khi fetch tỉnh thành:', err);
        this.isLoadingProvinces = false;
      }
    });
  }

  autoDetectLocation(provincesData: any[]) {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Sử dụng API reverse geocoding miễn phí
          this.http.get<any>(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`)
            .subscribe({
              next: (res) => {
                const names: string[] = [];
                if (res.principalSubdivision) names.push(res.principalSubdivision);
                if (res.city) names.push(res.city);
                if (res.locality) names.push(res.locality);
                if (res.localityInfo) {
                  if (res.localityInfo.administrative) res.localityInfo.administrative.forEach((a: any) => names.push(a.name));
                  if (res.localityInfo.informative) res.localityInfo.informative.forEach((i: any) => names.push(i.name));
                }

                // Tìm tỉnh khớp
                let matchedProvince = provincesData.find(p =>
                  names.some(n => n && p.name && (this.normalizeName(n).includes(this.normalizeName(p.name)) || this.normalizeName(p.name).includes(this.normalizeName(n))))
                );

                if (matchedProvince) {
                  this.selectedProvince = matchedProvince;
                  this.districts = matchedProvince.districts || [];

                  // Tìm quận/huyện khớp
                  let matchedDistrict = this.districts.find(d =>
                    names.some(n => n && d.name && (this.normalizeName(n).includes(this.normalizeName(d.name)) || this.normalizeName(d.name).includes(this.normalizeName(n))))
                  );

                  if (matchedDistrict) {
                    this.selectedDistrict = matchedDistrict;
                    this.onDistrictChange();
                  } else {
                    this.applyFilters();
                  }

                  this.messageService.add({
                    severity: 'info',
                    summary: 'Vị trí của bạn',
                    detail: `Đã tự động chọn khu vực: ${matchedDistrict ? matchedDistrict.name + ', ' : ''}${matchedProvince.name}`,
                    life: 3000
                  });
                } else {
                  this.setDefaultLocation(provincesData);
                }
              },
              error: () => this.setDefaultLocation(provincesData)
            });
        },
        (error) => {
          console.warn('Lỗi lấy vị trí:', error);
          this.setDefaultLocation(provincesData);
        },
        { timeout: 5000 }
      );
    } else {
      this.setDefaultLocation(provincesData);
    }
  }

  setDefaultLocation(provincesData: any[]) {
    const defaultProvince = provincesData.find(p => p.code === 1 || p.name.includes('Hà Nội')) || provincesData[0];
    if (defaultProvince) {
      this.selectedProvince = defaultProvince;
      this.districts = defaultProvince.districts || [];
    }
    this.applyFilters();
  }

  normalizeName(name: string): string {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/^(tỉnh|thành phố|quận|huyện|thị xã|phường|xã)\s+/i, '')
      .trim();
  }

  toggleApiVersion() {
    this.apiVersion = this.apiVersion === 'v1' ? 'v2' : 'v1';
    // Reset selections
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedWards = [];
    this.districts = [];
    this.wards = [];
    this.fetchProvinces();
    this.applyFilters();
  }

  onProvinceChange() {
    this.selectedDistrict = null;
    this.selectedWards = [];
    this.districts = this.selectedProvince?.districts || [];
    this.wards = [];
    this.applyFilters();
  }

  onDistrictChange() {
    this.selectedWards = [];
    this.wards = this.selectedDistrict?.wards || [];
    this.applyFilters();
  }

  onWardsChange() {
    this.applyFilters();
  }

  // ── Filter Logic ──────────────────────────────────────────
  applyFilters() {
    this.filteredChallenges = this.allChallenges.filter((item) => {
      // 1. Tab filter
      if (this.activeTab === 'team' && item.type !== 'team') return false;
      if (this.activeTab === 'individual') {
        if (item.type !== 'individual') return false;
        if (
          this.individualSubFilter !== 'all' &&
          item.individualSubtype !== this.individualSubFilter
        ) {
          return false;
        }
      }
      if (this.activeTab === 'my') {
        const isMyTeamChallenge = item.creatorTeam?.id === this.myTeam.id;
        const isMyUserChallenge = item.creatorUser?.id === 'user_current';
        if (!isMyTeamChallenge && !isMyUserChallenge) return false;
      }

      // 2. Search query
      const q = this.searchQuery.trim().toLowerCase();
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const pitchMatch = item.pitchName.toLowerCase().includes(q);
        const teamMatch = item.creatorTeam?.name.toLowerCase().includes(q) || false;
        const districtMatch = item.district.toLowerCase().includes(q);
        if (!titleMatch && !pitchMatch && !teamMatch && !districtMatch) return false;
      }

      // 3. Rank filter (Multi-select)
      if (this.selectedRanks.length > 0) {
        const teamRank = item.creatorTeam?.rank;
        const userRank = item.creatorUser?.rank;

        const matchTeam = teamRank && this.selectedRanks.includes(teamRank);
        const matchUser = userRank && this.selectedRanks.includes(userRank);
        const matchTarget = item.targetRanks.some(r => this.selectedRanks.includes(r as string));

        if (!matchTeam && !matchUser && !matchTarget) return false;
      }

      // 4. Format filter
      if (this.selectedFormat !== 'all' && item.format !== this.selectedFormat) {
        return false;
      }

      // 5. Fee Split filter
      if (this.selectedFeeSplit !== '' && item.feeSplit !== this.selectedFeeSplit) {
        return false;
      }

      // 6. Province / District filter
      if (this.selectedDistrictCode) {
        // Lọc theo quận/huyện đã chọn
        const districtObj = this.districts.find(d => d.code === this.selectedDistrictCode);
        if (districtObj) {
          const cleanSearchName = districtObj.name.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/i, '').toLowerCase();
          const itemDistrictClean = item.district.toLowerCase();
          if (!itemDistrictClean.includes(cleanSearchName) && !cleanSearchName.includes(itemDistrictClean)) {
            return false;
          }
        }
      } else if (this.selectedProvinceCode && this.districts.length > 0) {
        // Lọc theo tỉnh/thành đã chọn (nếu chưa chọn quận/huyện chi tiết)
        // Kiểm tra xem item.district có nằm trong danh sách districts của province không
        const itemDistrictClean = item.district.toLowerCase();

        // Nếu địa chỉ cụ thể có chứa tên tỉnh (vd: "Hà Nội")
        const provinceNameClean = this.selectedProvince?.name?.replace(/^(Tỉnh|Thành phố)\s+/i, '').toLowerCase() || '';
        const pitchAddressClean = (item.pitchAddress || '').toLowerCase();

        // Hoặc district của item khớp với bất kỳ district nào trong tỉnh
        const matchesAnyDistrict = this.districts.some(d => {
          const cleanSearchName = d.name.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/i, '').toLowerCase();
          return itemDistrictClean.includes(cleanSearchName) || cleanSearchName.includes(itemDistrictClean);
        });

        if (!matchesAnyDistrict && (!provinceNameClean || !pitchAddressClean.includes(provinceNameClean))) {
          return false;
        }
      }

      // 5.1. Wards filter (Bộ lọc phường/xã đa chọn)
      if (this.selectedWardCodes.length > 0) {
        // Lấy tên các phường xã đã chọn
        const selectedWardNames = this.wards
          .filter(w => this.selectedWardCodes.includes(w.code))
          .map(w => w.name.toLowerCase());

        const itemPitchName = item.pitchName.toLowerCase();
        const itemNote = item.note.toLowerCase();
        const itemTitle = item.title.toLowerCase();
        const itemAddress = (item.pitchAddress || '').toLowerCase();

        // Kiểm tra xem bài đăng có chứa bất kỳ tên phường xã nào đã chọn hay không
        const matchesAnyWard = selectedWardNames.some(wardName => {
          const cleanWardName = wardName.replace(/^(Phường|Xã|Thị trấn)\s+/i, '');
          return itemPitchName.includes(cleanWardName) ||
            itemNote.includes(cleanWardName) ||
            itemTitle.includes(cleanWardName) ||
            itemAddress.includes(cleanWardName);
        });

        if (!matchesAnyWard) return false;
      }

      // 6. Radius filter (Bộ lọc bán kính)
      if (this.selectedRadius !== 'all' && item.distanceKm !== undefined) {
        let maxKm = 0;
        if (this.selectedRadius === 'custom') {
          maxKm = this.customRadius || 9999;
        } else {
          maxKm = parseFloat(this.selectedRadius);
        }
        if (item.distanceKm > maxKm) return false;
      }

      // 7. Position filter (chỉ cho tab Ghép người đá)
      if (this.selectedPosition !== 'all' && item.type === 'individual') {
        if (item.individualSubtype === 'team_needs_player') {
          const posMatch = item.neededPositions?.includes(this.selectedPosition) ?? false;
          if (!posMatch) return false;
        } else if (item.individualSubtype === 'player_needs_team') {
          // Map position code -> keyword
          const posKeyMap: Record<string, string[]> = {
            GK: ['thủ môn', 'gk'],
            DF: ['hậu vệ', 'df', 'cb', 'lb', 'rb'],
            MF: ['tiền vệ', 'mf', 'cm', 'cam'],
            FW: ['tiền đạo', 'fw', 'cánh'],
          };
          const keywords = posKeyMap[this.selectedPosition] || [];
          const prefPos = item.creatorUser?.preferredPosition || '';
          const posText = (Array.isArray(prefPos) ? prefPos.join(' ') : prefPos).toLowerCase();
          if (!keywords.some((k) => posText.includes(k))) return false;
        }
      }

      // 8. Date Filter
      if (this.filterDate) {
        const itemDate = new Date(item.matchDate);
        if (
          itemDate.getFullYear() !== this.filterDate.getFullYear() ||
          itemDate.getMonth() !== this.filterDate.getMonth() ||
          itemDate.getDate() !== this.filterDate.getDate()
        ) {
          return false;
        }
      }

      // 9. Time Filter
      if (this.filterTimeFrom || this.filterTimeTo) {
        const matchTimeParts = item.matchTime.split('-');
        if (matchTimeParts.length === 2) {
          const startParts = matchTimeParts[0].trim().split(':');
          const endParts = matchTimeParts[1].trim().split(':');

          if (startParts.length === 2 && endParts.length === 2) {
            const matchStartMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
            const matchEndMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

            let filterStartMins = 0;
            let filterEndMins = 24 * 60;

            if (this.filterTimeFrom) {
              filterStartMins = this.filterTimeFrom.getHours() * 60 + this.filterTimeFrom.getMinutes();
            }
            if (this.filterTimeTo) {
              filterEndMins = this.filterTimeTo.getHours() * 60 + this.filterTimeTo.getMinutes();
            }

            if (matchEndMins < filterStartMins || matchStartMins > filterEndMins) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }

  setTab(tab: 'all' | 'team' | 'individual' | 'my') {
    this.activeTab = tab;
    if (tab !== 'individual') {
      this.individualSubFilter = 'all';
    }
    this.applyFilters();
  }

  setIndividualSubFilter(sub: 'all' | 'team_needs_player' | 'player_needs_team') {
    this.individualSubFilter = sub;
    this.applyFilters();
  }

  getRankLabel(): string {
    if (!this.selectedRanks || this.selectedRanks.length === 0) return 'Tất cả hạng';
    const first = this.selectedRanks[0];
    return this.selectedRanks.length > 1 ? `Hạng ${first} (+${this.selectedRanks.length - 1} hạng)` : `Hạng ${first}`;
  }

  get allRanksSelected(): boolean {
    return this.selectedRanks && this.selectedRanks.length === this.allRanks.length;
  }

  get indeterminateRanks(): boolean {
    return this.selectedRanks && this.selectedRanks.length > 0 && !this.allRanksSelected;
  }

  isRankSelected(rank: string): boolean {
    return this.selectedRanks && this.selectedRanks.includes(rank);
  }

  onToggleAllRanks(checked: boolean) {
    this.selectedRanks = checked ? [...this.allRanks] : [];
    this.applyFilters();
  }

  toggleRank(rank: string) {
    // Legacy function, handled by p-select now, but keeping just in case
    if (rank === 'all') {
      this.selectedRanks = [];
    } else {
      const idx = this.selectedRanks.indexOf(rank);
      if (idx > -1) {
        this.selectedRanks.splice(idx, 1);
      } else {
        this.selectedRanks.push(rank);
      }
    }
    this.applyFilters();
  }

  setFormat(format: string) {
    this.selectedFormat = format;
    this.applyFilters();
  }

  setFeeSplit(feeSplit: string) {
    this.selectedFeeSplit = feeSplit;
    this.applyFilters();
  }

  resetFilters() {
    this.activeTab = 'all';
    this.individualSubFilter = 'all';
    this.searchQuery = '';
    this.selectedRanks = [];
    this.selectedFormat = 'all';
    this.selectedFeeSplit = '';
    this.filterDate = null;
    this.filterTimeFrom = null;
    this.filterTimeTo = null;
    const defaultProv = this.provinces.find(p => p.code === 1 || p.name.includes('Hà Nội')) || this.provinces[0] || null;
    this.selectedProvince = defaultProv;
    this.selectedDistrict = null;
    this.selectedWards = [];
    this.wards = [];
    this.districts = defaultProv?.districts || [];
    this.selectedRadius = 'all';
    this.customRadius = null;
    this.selectedPosition = 'all';
    this.applyFilters();
  }

  toggleTargetRank(rank: RankTier) {
    const idx = this.newTargetRanks.indexOf(rank);
    if (idx >= 0) {
      if (this.newTargetRanks.length > 1) {
        this.newTargetRanks.splice(idx, 1);
      }
    } else {
      this.newTargetRanks.push(rank);
    }
  }

  // ── Open Modals ───────────────────────────────────────────
  // ══════════════════════════════════════════════════════
  //      CREATE CHALLENGE MODAL LOGIC
  // ══════════════════════════════════════════════════════

  openCreateChallenge() {
    if (!this.authService.currentUserValue) {
      this.authService.promptLogin();
      return;
    }
    // Set default location based on current filter or first province
    if (!this.newProvinceObj) {
      this.newProvinceObj = this.selectedProvince || (this.provinces.length > 0 ? this.provinces[0] : null);
      if (this.newProvinceObj) {
        this.newDistricts = this.newProvinceObj.districts || [];
        this.newDistrictObj = this.selectedDistrict || (this.newDistricts.length > 0 ? this.newDistricts[0] : null);
      }
    }

    this.updateDefaultTitle();
    this.showCreateDialog = true;
  }

  onNewProvinceChange() {
    this.newDistrictObj = null;
    this.newWardObj = null;
    this.newWards = [];
    this.newDistricts = this.newProvinceObj?.districts || [];
    this.updateDefaultTitle();
  }

  onNewDistrictChange() {
    this.newWardObj = null;
    this.newWards = this.newDistrictObj?.wards || [];
    this.updateDefaultTitle();
  }

  onNewWardChange() {
    this.updateDefaultTitle();
  }

  onPostTypeChange(type: 'team' | 'individual') {
    this.postType = type;
    this.updateDefaultTitle();
  }

  onIndividualSubtypeChange(subtype: IndividualSubtype) {
    this.createIndividualSubtype = subtype;
    this.updateDefaultTitle();
  }

  updateDefaultTitle() {
    if (this.postType === 'team') {
      this.newTitle = `Giao lưu ${this.newFormat === '7v7' ? 'sân 7' : 'sân 5'} tối nay tại ${this.myTeam.district}`;
      this.newNote = 'Đội văn phòng đá giao lưu vui vẻ nâng cao thể lực, không va chạm mạnh.';
    } else if (this.createIndividualSubtype === 'team_needs_player') {
      this.newTitle = `${this.myTeam.name} tìm ghép ${this.newNeededSlots} chân ghép đá tối nay`;
      this.newNote = 'Đội mình thiếu người đá vị trí tiền vệ/hậu vệ, anh em đá vui vẻ, chia tiền sân theo đầu người.';
    } else {
      const wardName = this.newWardObj ? this.newWardObj.name + ', ' : '';
      const districtName = this.newDistrictObj ? this.newDistrictObj.name : 'Chưa rõ';
      this.newTitle = 'Cầu thủ tự do tìm đội ghép đá tối nay tại khu vực ' + wardName + districtName;
      const positionsStr = this.newPreferredPosition && this.newPreferredPosition.length > 0
        ? this.newPreferredPosition.join(', ')
        : 'bất kỳ';
      this.newNote = 'Mình đá vị trí ' + positionsStr + ', thể lực tốt, thi đấu nhiệt tình và có trách nhiệm.';
    }
  }

  closeCreateDialog() {
    this.showCreateDialog = false;
  }

  submitNewChallenge() {
    if (!this.newTitle.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu tiêu đề',
        detail: 'Vui lòng nhập tiêu đề bài viết.',
      });
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const isTeam = this.postType === 'team';
      const isTeamNeedsPlayer = this.postType === 'individual' && this.createIndividualSubtype === 'team_needs_player';

      const newChallenge: Challenge = {
        id: 'new_' + new Date().getTime(),
        type: this.postType,
        individualSubtype: this.postType === 'individual' ? this.createIndividualSubtype : undefined,
        format: this.newFormat,
        formatLabel: this.newFormat === '5v5' ? 'Sân 5' : this.newFormat === '7v7' ? 'Sân 7' : 'Sân 11',
        matchDate: this.newDate,
        matchTime: (this.newTimeFrom && this.newTimeTo)
          ? `${this.newTimeFrom.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${this.newTimeTo.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
          : '19:00 - 20:30',
        pitchName: this.newPitch,
        pitchAddress: `${this.newPitch}, ${this.newDistrictObj?.name || ''}, ${this.newProvinceObj?.name || 'Hà Nội'}`,
        district: this.newDistrictObj?.name || '',
        feeSplit: this.newFeeSplit,
        feeSplitLabel:
          this.newFeeSplit === '50-50'
            ? 'Cưa đôi / Chia theo đầu người'
            : this.newFeeSplit === 'loser-pays'
              ? 'Bên thua trả tiền sân'
              : 'Chia 60-40',
        creatorTeam: isTeam || isTeamNeedsPlayer ? this.myTeam : undefined,
        creatorUser:
          !isTeam && !isTeamNeedsPlayer
            ? {
              id: 'user_current',
              name: 'Nguyễn Văn A (Bạn)',
              avatar: 'https://i.pravatar.cc/150?u=user_current',
              rank: 'B',
              elo: 1540,
              phone: '0988 888 888',
              preferredPosition: this.newPreferredPosition,
            }
            : undefined,
        neededSlots: isTeamNeedsPlayer ? this.newNeededSlots : undefined,
        title: this.newTitle,
        estimatedPrice: this.newEstimatedPrice,
        targetRanks: [...this.newTargetRanks],
        note: this.newNote,
        status: 'open',
        createdAt: 'Vừa xong',
        applicantsCount: 0,
        hasPitchAlready: this.newHasPitch,
        contactPhone: '0988 888 888',
      };

      this.allChallenges.unshift(newChallenge);
      this.applyFilters();

      this.isSubmitting = false;
      this.showCreateDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Đăng bài thành công!',
        detail: 'Yêu cầu của bạn đã được cập nhật lên hệ thống ghép kèo.',
        life: 4000,
      });
    }, 600);
  }

  // ── Modals / Actions ───────────────────────────────────────
  openPitchDetail(challenge: Challenge, event?: Event) {
    if (event) event.stopPropagation();

    const apiPitch = challenge['pitch'];
    const foundPitch = MOCK_PITCHES.find(p => p.name === challenge.pitchName);
    if (apiPitch) {
      this.selectedPitch = {
        ...apiPitch,
        images: this.parsePitchImages(apiPitch.images),
        facilities: Array.isArray(apiPitch.facilities) ? apiPitch.facilities : [],
        subPitches: [],
        availableSlotsCount: 0,
        distanceKm: challenge.distanceKm || 0,
        isVerified: false,
      } as Pitch;
    } else if (foundPitch) {
      this.selectedPitch = foundPitch;
    } else {
      this.selectedPitch = {
        id: 'fallback_pitch',
        name: challenge.pitchName,
        address: challenge.pitchAddress || 'Đang cập nhật',
        district: challenge.district || 'Hà Nội',
        city: 'Hà Nội',
        phone: '0988 888 888',
        lat: 21.0285,
        lng: 105.8542,
        distanceKm: challenge.distanceKm || 5.2,
        rating: 4.5,
        reviewCount: 120,
        minPrice: 300000,
        maxPrice: 600000,
        images: [],
        coverImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        openHours: '06:00 - 23:00',
        description: 'Sân bóng chất lượng cao tại khu vực này.',
        facilities: ['fac_1', 'fac_2', 'fac_3'],
        subPitches: [],
        availableSlotsCount: 5,
        isVerified: true
      } as Pitch;
    }

    this.showPitchModal = true;
  }

  private parsePitchImages(images: unknown): string[] {
    if (Array.isArray(images)) return images;
    if (typeof images !== 'string') return [];
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  openTeamDetail(team: Team, event?: Event) {
    if (!team) return;
    this.selectedTeam = team;
    this.showTeamModal = true;
  }

  closeTeamModal() {
    this.showTeamModal = false;
  }

  // ── Quick Chat Modal ──────────────────────────────────────
  openChat(challenge: Challenge, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.authService.currentUserValue) {
      this.authService.promptLogin();
      return;
    }
    this.selectedChallenge = challenge;
    this.chatMessages = MOCK_CHATS[challenge.id] || [
      {
        id: 'msg_welcome',
        senderId: challenge.creatorTeam?.id || 'team_other',
        senderName: challenge.creatorTeam?.name || challenge.creatorUser?.name || 'Đối thủ',
        senderAvatar: challenge.creatorTeam?.logo || challenge.creatorUser?.avatar || '',
        text: `Chào bạn! ${challenge.individualSubtype === 'team_needs_player'
          ? 'Đội mình đang tìm người đá vào ' + challenge.matchDate + '. Bạn có thể tham gia không?'
          : challenge.individualSubtype === 'player_needs_team'
            ? 'Mình đang tìm đội đá vào ' + challenge.matchDate + '. Đội bạn có slot không?'
            : 'Đội mình muốn giao lưu vào ' + challenge.matchDate + '. Bạn muốn trao đổi thêm không?'
          }`,
        timestamp: 'Vừa xong',
        isMine: false,
      },
    ];
    this.newChatMessage = '';
    this.showChatModal = true;
  }

  closeChatModal() {
    this.showChatModal = false;
  }

  sendChatMessage() {
    if (!this.newChatMessage.trim()) return;

    const msg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'my_id',
      senderName: this.myTeam.name,
      senderAvatar: this.myTeam.logo,
      text: this.newChatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    this.chatMessages.push(msg);
    this.newChatMessage = '';

    // Auto opponent response after 1s
    setTimeout(() => {
      const replyText =
        this.selectedChallenge?.individualSubtype === 'team_needs_player'
          ? 'Oke bạn! Hoan nghênh bạn tham gia cùng đội, hẹn gặp tại sân nhé!'
          : this.selectedChallenge?.individualSubtype === 'player_needs_team'
            ? 'Cảm ơn đội bạn đã mời! Tối nay mình sẽ có mặt đúng giờ.'
            : 'Oke bạn nhé, bên mình nhận kèo! Hẹn bạn đúng giờ tại sân bóng.';

      this.chatMessages.push({
        id: 'msg_reply_' + Date.now(),
        senderId: this.selectedChallenge?.creatorTeam?.id || 'opponent',
        senderName: this.selectedChallenge?.creatorTeam?.name || this.selectedChallenge?.creatorUser?.name || 'Đối thủ',
        senderAvatar: this.selectedChallenge?.creatorTeam?.logo || this.selectedChallenge?.creatorUser?.avatar || '',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
      });
    }, 1000);
  }

  sendQuickReply(text: string) {
    this.newChatMessage = text;
    this.sendChatMessage();
  }

  // ── Match Challenge Flow ──────────────────────────────────
  openMatchConfirm(challenge: Challenge, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.authService.currentUserValue) {
      this.authService.promptLogin();
      return;
    }
    this.selectedChallenge = challenge;
    this.showMatchConfirmModal = true;
  }

  closeMatchConfirmModal() {
    this.showMatchConfirmModal = false;
  }

  confirmChallengeMatch() {
    if (!this.selectedChallenge) return;

    this.selectedChallenge.status = 'matched';
    this.selectedChallenge.applicantsCount += 1;
    this.showMatchConfirmModal = false;
    this.showSuccessModal = true;

    const summaryText =
      this.selectedChallenge.individualSubtype === 'team_needs_player'
        ? 'Đăng ký ghép đội thành công!'
        : this.selectedChallenge.individualSubtype === 'player_needs_team'
          ? 'Đã gửi lời mời tham gia đội!'
          : 'Ghép trận thành công!';

    const detailText =
      this.selectedChallenge.individualSubtype === 'team_needs_player'
        ? `Bạn đã đăng ký tham gia thi đấu cùng ${this.selectedChallenge.creatorTeam?.name}!`
        : this.selectedChallenge.individualSubtype === 'player_needs_team'
          ? `Lời mời gia nhập trận đấu đã được gửi đến ${this.selectedChallenge.creatorUser?.name}!`
          : `Trận đấu giữa FC Bão Táp và ${this.selectedChallenge.creatorTeam?.name || 'đối thủ'} đã được tạo!`;

    this.messageService.add({
      severity: 'success',
      summary: summaryText,
      detail: detailText,
      life: 5000,
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // ── Button Text & Helpers ─────────────────────────────────
  getActionButtonText(chl: Challenge): string {
    if (chl.status === 'matched') {
      return 'Đã ghép đủ';
    }
    if (chl.type === 'individual') {
      if (chl.individualSubtype === 'team_needs_player') {
        return 'Xin ghép slot 🙋';
      }
      if (chl.individualSubtype === 'player_needs_team') {
        return 'Mời vào đội đá 🤝';
      }
    }
    return 'Thách đấu ngay ⚡';
  }

  getMatchConfirmTitle(chl: Challenge): string {
    if (chl.type === 'individual') {
      if (chl.individualSubtype === 'team_needs_player') {
        return 'Xác nhận Đăng ký Ghép Đội';
      }
      if (chl.individualSubtype === 'player_needs_team') {
        return 'Xác nhận Mời Cầu Thủ Vào Đội';
      }
    }
    return 'Xác nhận Thách đấu & Ghép trận';
  }

  getMatchConfirmButtonText(chl: Challenge): string {
    if (chl.type === 'individual') {
      if (chl.individualSubtype === 'team_needs_player') {
        return 'Xác nhận Tham Gia';
      }
      if (chl.individualSubtype === 'player_needs_team') {
        return 'Gửi Lời Mời Vào Đội';
      }
    }
    return 'Chốt kèo & Ghép trận';
  }

  getRankInfo(tier: RankTier): RankInfo {
    return this.rankTiers[tier] || this.rankTiers['F'];
  }

  formatPrice(val: number): string {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  }

  // ── Distance Helper ───────────────────────────────────────────────────
  /** Hiển thị nhãn khoảng cách kèm màu sắc động */
  getDistanceLabel(km: number | undefined): { text: string; color: string } {
    if (km === undefined) return { text: 'N/A', color: 'var(--text-tertiary)' };
    if (km <= 1) return { text: km.toFixed(1) + ' km – Rất gần', color: 'var(--brand-primary)' };
    if (km <= 3) return { text: km.toFixed(1) + ' km – Gần', color: '#1D9E75' };
    if (km <= 6) return { text: km.toFixed(1) + ' km – Vừa', color: '#EF9F27' };
    return { text: km.toFixed(1) + ' km – Hơi xa', color: '#E24A4A' };
  }

  setRadius(r: string) {
    this.selectedRadius = r;
    this.applyFilters();
  }

  setPosition(pos: string) {
    this.selectedPosition = pos;
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  // ── Label Helpers cho #selectedItem templates (theo pattern PrimeNG) ─────
  getProvinceLabel(): string {
    return this.selectedProvince?.name ?? '';
  }

  getDistrictLabel(): string {
    if (!this.selectedDistrict?.length) {
      return 'Tất cả Quận / Huyện';
    }

    const first = this.selectedDistrict[0]?.name ?? '';

    const label =
      this.selectedDistrict.length > 1
        ? `${first} (+${this.selectedDistrict.length - 1} more)`
        : first;

    console.log('getDistrictLabel:', {
      selectedDistrict: this.selectedDistrict,
      label
    });

    return label;
  }

  getWardsLabel(): string {
    if (!this.selectedWards || this.selectedWards.length === 0) return '';
    if (this.selectedWards.length === 1) return this.selectedWards[0].name;
    return `${this.selectedWards[0].name} (+${this.selectedWards.length - 1} more)`;
  }
}
