import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';
import { PlayerProfileService } from '../../../services/playerprofile/playerprofile.service';
import { FacebookSdkService } from '../../../services/facebook/facebook-sdk.service';

declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  isLoading = false;
  isFbLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    private playerProfileService: PlayerProfileService,
    private facebookSdk: FacebookSdkService
  ) {}

  ngOnInit(): void {
    // Pre-load Facebook SDK ngầm khi component khởi tạo
    this.facebookSdk.loadSdk().catch(() => {
      // Bỏ qua lỗi load SDK ở đây – sẽ báo lỗi khi user click login
    });
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.checkProfileAndRedirect(res.user.id);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Đăng nhập thất bại. Kiểm tra lại thông tin.';
        console.error(err);
      }
    });
  }

  loginWithFacebook() {
    this.isFbLoading = true;
    this.errorMessage = '';

    this.facebookSdk.login('public_profile,email').then((result) => {
      if (result.status === 'connected' && result.authResponse?.accessToken) {
        const accessToken = result.authResponse.accessToken;

        // Lấy thông tin profile Facebook ngay tại đây (còn trong session)
        FB.api('/me', { fields: 'name,picture.type(large)' }, (fbProfile: any) => {
          const fbName: string = (!fbProfile || fbProfile.error) ? '' : (fbProfile.name || '');
          const fbAvatar: string = (!fbProfile || fbProfile.error) ? '' : (fbProfile.picture?.data?.url || '');

          // Gửi accessToken lên backend để xác thực và lấy JWT
          this.authService.loginWithFacebook(accessToken).subscribe({
            next: (res) => {
              this.checkProfileAndRedirect(res.user.id, true, fbName, fbAvatar);
            },
            error: (err) => {
              this.isFbLoading = false;
              this.errorMessage = 'Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.';
              console.error('Facebook login error:', err);
            }
          });
        });
      } else if (result.status === 'not_authorized') {
        this.isFbLoading = false;
        this.errorMessage = 'Bạn cần cấp quyền cho PitchVN để tiếp tục đăng nhập.';
      } else {
        // Người dùng đóng popup hoặc huỷ
        this.isFbLoading = false;
      }
    }).catch((err) => {
      this.isFbLoading = false;
      this.errorMessage = 'Không thể kết nối đến Facebook. Vui lòng kiểm tra kết nối mạng.';
      console.error('Facebook SDK error:', err);
    });
  }

  private checkProfileAndRedirect(
    userId: string,
    isFacebook: boolean = false,
    fbName: string = '',
    fbAvatar: string = ''
  ) {
    this.playerProfileService.getByUserId(userId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isFbLoading = false;
        this.router.navigate(['/feed']);
      },
      error: () => {
        this.isLoading = false;
        this.isFbLoading = false;
        if (isFacebook) {
          // Truyền thông tin Facebook qua navigation state (không xuất hiện trên URL)
          this.router.navigate(['/setup-profile'], {
            queryParams: { isFacebook: 'true' },
            state: { fbName, fbAvatar }
          });
        } else {
          this.router.navigate(['/setup-profile']);
        }
      }
    });
  }
}
