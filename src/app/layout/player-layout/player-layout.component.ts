import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-player-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, PopoverModule],
  templateUrl: './player-layout.component.html',
  styleUrls: ['./player-layout.component.css']
})
export class PlayerLayoutComponent {
  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) { }
}
