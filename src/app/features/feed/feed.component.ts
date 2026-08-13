import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';

import { MOCK_FEED, MOCK_FOLLOWING_FEED, Post, MOCK_USERS } from './mock-feed-data';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCardComponent, DialogModule, ToastModule, SharedModule],
  providers: [MessageService],
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.css'],
})
export class FeedComponent implements OnInit {
  // ── Tab state ────────────────────────────────────────────
  activeTab = 'foryou'; // 'foryou' | 'following'
  feedList: Post[] = [];
  isTransitioning = false;

  // ── Compose dialog ───────────────────────────────────────
  showComposeDialog = false;
  composeText = '';
  composeVisibility = 'Tất cả mọi người';
  isPosting = false;

  // ── Current user ─────────────────────────────────────────
  currentUser = MOCK_USERS['me'];

  // ── Visibility options ────────────────────────────────────
  visibilityOptions = [
    { label: 'Tất cả mọi người', icon: 'pi pi-globe' },
    { label: 'Chỉ người theo dõi', icon: 'pi pi-users' },
    { label: 'Chỉ bạn bè', icon: 'pi pi-user-plus' },
  ];
  showVisibilityMenu = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.feedList = MOCK_FEED;
  }

  // ── Tab switching ─────────────────────────────────────────
  setTab(tab: string) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.feedList = tab === 'foryou' ? MOCK_FEED : MOCK_FOLLOWING_FEED;
  }

  // ── Compose ───────────────────────────────────────────────
  openCompose() {
    this.composeText = '';
    this.composeVisibility = 'Tất cả mọi người';
    this.showVisibilityMenu = false;
    this.showComposeDialog = true;
  }

  closeCompose() {
    this.showComposeDialog = false;
    this.composeText = '';
  }

  submitPost() {
    if (!this.composeText.trim() || this.isPosting) return;

    this.isPosting = true;

    // Simulate a short async delay (API call)
    setTimeout(() => {
      const newPost: Post = {
        id: 'new_' + Date.now(),
        author: this.currentUser,
        type: 'general',
        typeLabel: 'Tin tức',
        time: 'Vừa xong',
        content: this.composeText.trim(),
        images: [],
        likes: 0,
        comments: 0,
        reposts: 0,
        shares: 0,
        views: 0,
        isLiked: false,
        isReposted: false,
      };

      // Prepend to feed
      this.feedList = [newPost, ...this.feedList];
      this.isPosting = false;
      this.closeCompose();

      this.messageService.add({
        severity: 'success',
        summary: 'Đã đăng!',
        detail: 'Bài viết của bạn đã được đăng.',
        life: 2500,
      });
    }, 600);
  }

  // ── Visibility ────────────────────────────────────────────
  toggleVisibilityMenu() {
    this.showVisibilityMenu = !this.showVisibilityMenu;
  }

  selectVisibility(option: { label: string }) {
    this.composeVisibility = option.label;
    this.showVisibilityMenu = false;
  }

  get canPost(): boolean {
    return this.composeText.trim().length > 0 && !this.isPosting;
  }

  get charCount(): number {
    return this.composeText.length;
  }

  get charLimit(): number {
    return 500;
  }

  get isNearLimit(): boolean {
    return this.charCount > this.charLimit * 0.8;
  }

  get isOverLimit(): boolean {
    return this.charCount > this.charLimit;
  }
}
