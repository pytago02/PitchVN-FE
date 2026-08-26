import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

import { Post as UIPost, PostUser, MOCK_USERS } from './mock-feed-data';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCardComponent, DialogModule, ToastModule, SharedModule, SkeletonModule],
  providers: [MessageService],
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.css'],
})
export class FeedComponent implements OnInit {
  // ── Tab state ────────────────────────────────────────────
  activeTab = 'foryou'; // 'foryou' | 'following'
  feedList: UIPost[] = [];
  isTransitioning = false;
  isLoading = true; // Added loading state

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

  constructor(
    private messageService: MessageService,
    private postService: PostService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    this.isLoading = true;
    this.feedList = [];
    
    this.userService.getAll().subscribe({
      next: (users) => {
        const userMap = new Map<string, User>();
        if (Array.isArray(users)) {
          users.forEach(u => {
            if (u && u.id) userMap.set(u.id, u);
          });
        }

        this.postService.getAll().subscribe({
          next: (posts) => {
            if (!Array.isArray(posts)) {
              this.feedList = [];
              this.isLoading = false;
              this.cdr.detectChanges();
              return;
            }

            this.feedList = posts.map(p => {
              try {
                if (!p) return null;
                const authorId = p['authorId'] || '';
                const u = userMap.get(authorId) || {} as User;
              const author: PostUser = {
                id: u.id || p['authorId'],
                name: u['username'] || 'Unknown',
                username: u['username'] || 'unknown',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u['username'],
                role: u['role'] as any || 'player'
              };

              let images = [];
              try {
                if (p['images']) images = JSON.parse(p['images']).map((img: string) => ({ url: img }));
              } catch (e) {}

              return {
                id: p.id || '',
                author: author,
                type: 'general',
                typeLabel: p['postType'] === 'general' ? 'Tin tức' : 'Thông báo',
                time: new Date(p['createdAt']).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
                content: p['content'] || '',
                images: images,
                likes: p['likesCount'] || 0,
                comments: p['commentsCount'] || 0,
                reposts: p['repostsCount'] || 0,
                shares: p['sharesCount'] || 0,
                isLiked: false,
                isReposted: false,
                location: p['pitchName'] || p['location'] || undefined
              };
              } catch (e) {
                console.error('Error mapping post:', e);
                return null;
              }
            }).filter(Boolean) as any[];
            this.isLoading = false;
            this.cdr.detectChanges();

            // Fetch isLiked status for each post in the background
            // Use object spread to create new reference → triggers ngOnChanges in PostCard
            this.feedList.forEach((post, idx) => {
              if (post?.id) {
                this.postService.isLiked(post.id.toString()).subscribe({
                  next: (res) => {
                    this.feedList[idx] = { ...this.feedList[idx], isLiked: res.isLiked };
                    this.cdr.detectChanges();
                  },
                  error: () => { /* silently ignore */ }
                });
              }
            });
          },
          error: () => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Tab switching ─────────────────────────────────────────
  setTab(tab: string) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.isTransitioning = true;
    setTimeout(() => {
      this.isTransitioning = false;
      this.cdr.detectChanges();
    }, 300);
    // You could reload filtered feed here based on tab
  }

  // ── Compose ───────────────────────────────────────────────
  openCompose() {
    if (!this.authService.currentUserValue) {
      this.authService.promptLogin();
      return;
    }
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

    // Use service to create real post
    this.postService.create({
      authorId: '00000000-0000-0000-0000-000000000007', // Hardcoded a user for now
      authorType: 'player',
      postType: 'general',
      content: this.composeText.trim(),
      likesCount: 0,
      commentsCount: 0
    }).subscribe({
      next: (res) => {
        this.isPosting = false;
        this.closeCompose();
        this.loadFeed(); // Reload feed to see new post
        this.messageService.add({ severity: 'success', summary: 'Đã đăng!', detail: 'Bài viết của bạn đã được đăng.', life: 2500 });
      },
      error: () => {
        this.isPosting = false;
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể đăng bài viết.', life: 2500 });
      }
    });
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
