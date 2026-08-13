import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-player-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, PopoverModule],
  templateUrl: './player-layout.component.html',
  styleUrls: ['./player-layout.component.css']
})
export class PlayerLayoutComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Fallback to system preference
      this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }
}
