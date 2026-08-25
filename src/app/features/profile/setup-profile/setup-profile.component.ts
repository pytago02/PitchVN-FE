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
  province: string = '';
  avatar = 'https://i.pravatar.cc/150';

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
      if(data.length > 0) this.footId = data[0].id;
    });

    this.provinceService.showAllDivisions('v1', 2).subscribe({
      next: (data) => {
        this.provinces = data;
        const defaultProv = data.find(p => p.code === 1 || p.name.includes('Hà N?i')) || data[0];
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
    this.name = user.name || (user as any).username || 'Ngu?i choi m?i';

    this.route.queryParams.subscribe(params => {
      if (params['isFacebook'] === 'true') {
        this.bio = 'Ð?n t? Facebook';
        this.avatar = 'https://i.pravatar.cc/150?u=' + this.userId;
      }
    });
  }

  onProvinceChange() {
    this.selectedDistrictObj = null;
    this.districts = this.selectedProvinceObj?.districts || [];
  }

  onSave() {
    if (!this.name) {
      this.errorMessage = 'Vui lòng nh?p tên hi?n th?';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const finalProvinceStr = this.selectedDistrictObj
      ? `, `
      : (this.selectedProvinceObj?.name || 'Hà N?i');

    const newProfile = {
      userId: this.userId,
      name: this.name,
      avatar: this.avatar,
      bio: this.bio,
      positionIds: this.positionIds,
      footId: this.footId,
      province: finalProvinceStr,
      isPrivate: false
    };

    this.playerProfileService.create(newProfile).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Có l?i x?y ra khi t?o h? so. Vui lòng th? l?i.';
        console.error(err);
      }
    });
  }
}

