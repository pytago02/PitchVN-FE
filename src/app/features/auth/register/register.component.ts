import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  isFbLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    public themeService: ThemeService
  ) { }

  onRegister() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Đã có lỗi xảy ra khi đăng ký.';
      }
    });
  }

  loginWithFacebook() {
    this.isFbLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const mockFbToken = 'mock_fb_access_token_' + Date.now();

      this.authService.loginWithFacebook(mockFbToken).subscribe({
        next: (res) => {
          this.isFbLoading = false;
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.isFbLoading = false;
          this.errorMessage = 'Lỗi đăng ký bằng Facebook.';
        }
      });
    }, 1500);
  }
}




