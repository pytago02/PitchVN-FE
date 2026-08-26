import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';
import { PlayerProfileService } from '../../../services/playerprofile/playerprofile.service';
import { ProvinceService, Province } from '../../../services/provinces/province-service';
import { MasterDataService, MasterData } from '../../../services/master-data/master-data.service';

@Component({
  selector: 'app-setup-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule, SelectModule, MultiSelectModule, ButtonModule],
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.css'],
})
export class SetupProfileComponent implements OnInit {
  userId = '';
  name = '';
  bio = '';
  positionIds: string[] = [];
  footId: string = '';
  avatar = 'https://i.pravatar.cc/150';

  isFacebookMode = false;
  fbInfoLoaded = false;
  fbName = '';
  fbAvatar = '';
  fbProfileUrl = '';   // URL trang Facebook cua nguoi dung

  isLoading: boolean = false;
  errorMessage: string = '';

  positionOptions: MasterData[] = [];
  footOptions: MasterData[] = [];

  provinces: Province[] = [];
  districts: any[] = [];

  selectedProvinceObj: any = null;
  selectedDistrictObj: any = null;

  constructor(
    private authService: AuthService,
    private playerProfileService: PlayerProfileService,
    private provinceService: ProvinceService,
    private masterDataService: MasterDataService,
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.masterDataService.getPositions().subscribe(data => this.positionOptions = data);
    this.masterDataService.getFoots().subscribe(data => {
      this.footOptions = data;
      if (data.length > 0) this.footId = data[0].id;
    });

    this.provinceService.showAllDivisions('v1', 2).subscribe({
      next: (data) => {
        this.provinces = data;
        const defaultProv = data.find((p: Province) => p.code === 1 || p.name.includes('Ha Noi')) || data[0];
        if (defaultProv) {
          this.selectedProvinceObj = defaultProv;
          this.districts = defaultProv.districts || [];
        }
      }
    });

    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = user.id;
    this.name = user.name || (user as any).username || 'Nguoi choi moi';

    this.route.queryParams.subscribe(params => {
      if (params['isFacebook'] === 'true') {
        this.isFacebookMode = true;

        // Doc thong tin Facebook tu Router navigation state
        const navState = this.router.getCurrentNavigation()?.extras?.state
          || (history.state as { fbName?: string; fbAvatar?: string; fbProfileUrl?: string });

        const fbName: string = navState?.['fbName'] || '';
        const fbAvatar: string = navState?.['fbAvatar'] || '';

        // Lay fbProfileUrl tu localStorage (da luu khi login)
        this.fbProfileUrl = this.authService.getFbProfileUrl() || '';

        if (fbName || fbAvatar) {
          this.fbInfoLoaded = true;
          this.fbName = fbName;
          this.fbAvatar = fbAvatar;
          if (fbName) this.name = fbName;
          if (fbAvatar) this.avatar = fbAvatar;
        }
      }
    });
  }

  /** Nguoi dung co the ap dung lai thong tin tu Facebook */
  applyFacebookInfo() {
    if (this.fbName) this.name = this.fbName;
    if (this.fbAvatar) this.avatar = this.fbAvatar;
  }

  onProvinceChange() {
    this.selectedDistrictObj = null;
    this.districts = this.selectedProvinceObj?.districts || [];
  }

  onSave() {
    if (!this.name) {
      this.errorMessage = 'Vui long nhap ten hien thi';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // province_id va district_id luu theo code (so nguyen -> string)
    const provinceId: string | null = this.selectedProvinceObj?.code?.toString() || null;
    const districtId: string | null = this.selectedDistrictObj?.code?.toString() || null;

    // Tu dong tao social_links voi Facebook URL neu dang nhap bang Facebook
    let socialLinks: string | undefined = undefined;
    if (this.fbProfileUrl) {
      socialLinks = JSON.stringify({ fb: this.fbProfileUrl });
    }

    const newProfile = {
      userId: this.userId,
      name: this.name,
      avatar: this.avatar,
      bio: this.bio,
      positionIds: this.positionIds,   // mang UUID cua vi tri
      footId: this.footId || null,      // UUID cua chan thuan
      provinceId: provinceId,           // code tinh/thanh (string)
      districtId: districtId,           // code quan/huyen (string)
      isPrivate: false,
      socialLinks: socialLinks
    };

    this.playerProfileService.create(newProfile).subscribe({
      next: () => {
        this.isLoading = false;
        // Xoa fbProfileUrl sau khi da luu vao profile
        localStorage.removeItem('fbProfileUrl');
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Co loi xay ra khi tao ho so. Vui long thu lai.';
        console.error(err);
      }
    });
  }
}
