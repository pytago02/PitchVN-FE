import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';
import { PlayerProfileService } from '../../../services/playerprofile/playerprofile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  isFbLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    public themeService: ThemeService,
    private playerProfileService: PlayerProfileService
  ) {}

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

    // Mock Facebook Login delay
    setTimeout(() => {
      // In a real scenario, this uses the Facebook SDK to get the access token
      const mockFbToken = 'mock_fb_access_token_' + Date.now();
      
      this.authService.loginWithFacebook(mockFbToken).subscribe({
        next: (res) => {
          this.checkProfileAndRedirect(res.user.id, true);
        },
        error: (err) => {
          this.isFbLoading = false;
          this.errorMessage = 'Lỗi đăng nhập bằng Facebook.';
        }
      });
    }, 1500);
  }

  private checkProfileAndRedirect(userId: string, isFacebook: boolean = false) {
    this.playerProfileService.getByUserId(userId).subscribe({
      next: (profile) => {
        this.isLoading = false;
        this.isFbLoading = false;
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isFbLoading = false;
        // 404 means profile doesn't exist
        if (isFacebook) {
          this.router.navigate(['/setup-profile'], { queryParams: { isFacebook: 'true' } });
        } else {
          this.router.navigate(['/setup-profile']);
        }
      }
    });
  }
}


