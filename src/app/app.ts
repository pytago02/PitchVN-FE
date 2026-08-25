import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class App implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Quyền đã được cấp, vị trí sẽ được sử dụng ở các component khác khi cần
        },
        (error) => {
          console.warn('Lỗi hoặc từ chối lấy vị trí:', error);
        }
      );
    }
  }
}
