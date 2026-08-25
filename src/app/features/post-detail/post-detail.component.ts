import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { MOCK_FEED, MOCK_FOLLOWING_FEED, MOCK_REPLIES, Post, Reply } from '../feed/mock-feed-data';

import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { PostInteractionService } from '../../services/postinteraction/postinteraction.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCardComponent, DialogModule, ToastModule, SharedModule, SkeletonModule],
  providers: [MessageService],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  replies: Reply[] = [];
  parentPostId: string | null = null;

  // ── Filter state ───────────────────────────────────────────
  activeFilter = 'Hàng đầu';
  showFilterDropdown = false;

  // ── Activity Modal ─────────────────────────────────────────
  showActivityModal = false;
  activeModalSort = 'Mặc định';
  showModalSortDropdown = false;

  // ── Reply input ───────────────────────────────────────────
  replyText = '';
  isSubmittingReply = false;

  // ── Expanded nested replies ────────────────────────────────
  expandedReplies: Set<string> = new Set();
  nestedReplies: Record<string, Reply[]> = {};

  // ── Activity Modal Data ────────────────────────────────────
  activityStats = {
    views: '10.859',
    likes: '256',
    reposts: '11',
  };

  activityUsers = [
    { name: 'akasor_04', fullname: 'Trần Trịnh Kim Anh', time: '4 giờ', avatar: 'https://i.pravatar.cc/150?u=a1' },
    { name: 'meiji_1708', fullname: 'người buồn', time: '3 giờ', avatar: 'https://i.pravatar.cc/150?u=a2' },
    { name: 'ntt.nov29', fullname: 'Nguyễn Thu Trang', time: '10 giờ', avatar: 'https://i.pravatar.cc/150?u=a3' },
    { name: 'mrdracule', fullname: 'Nguyễn Bình Khiêm', time: '3 giờ', avatar: 'https://i.pravatar.cc/150?u=a4' },
    { name: 'huynguyen_1302', fullname: 'Văn Huy Nguyễn', time: '3 giờ', avatar: 'https://i.pravatar.cc/150?u=a5' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private postService: PostService,
    private userService: UserService,
    private postInteractionService: PostInteractionService
  ) {}

  isLoading = true;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isLoading = true;
        
        // Use forkJoin or nested subscribes to get users, post, and replies
        this.userService.getAll().subscribe({
          next: (users) => {
            const userMap = new Map<string, User>();
            users.forEach(u => userMap.set(u.id!, u));

            this.postService.getById(id).subscribe({
              next: (p) => {
                const u = userMap.get(p['authorId']) || {} as User;
                let images = [];
                try { if (p['images']) images = JSON.parse(p['images']).map((img: string) => ({ url: img })); } catch (e) {}
                
                this.post = {
                  id: p.id || '',
                  author: {
                    id: u.id || '',
                    name: u['username'] || 'Unknown',
                    username: u['username'] || 'unknown',
                    avatar: u['avatar'] || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u['username'],
                    verified: false
                  },
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

                // Fetch replies
                this.postInteractionService.getAll().subscribe({
                  next: (interactions) => {
                    // Filter replies for this post
                    const postReplies = interactions.filter(i => i['postId'] === id);
                    this.replies = postReplies.map(r => {
                      const ru = userMap.get(r['userId']) || {} as User;
                      return {
                        id: r.id || '',
                        author: {
                          id: ru.id || '',
                          name: ru['username'] || 'Unknown',
                          username: ru['username'] || 'unknown',
                          avatar: ru['avatar'] || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + ru['username'],
                          verified: false
                        },
                        type: 'general',
                        typeLabel: 'Bình luận',
                        time: new Date(r['createdAt']).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
                        content: r['content'] || '',
                        likes: 0,
                        comments: 0,
                        reposts: 0,
                        shares: 0,
                        replyTo: r['replyToId'] || id
                      };
                    });
                    this.isLoading = false;
                  },
                  error: () => this.isLoading = false
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
              error: () => this.isLoading = false
            });
          },
          error: () => this.isLoading = false
        });
      }
    });
  }

  // ── Navigation ─────────────────────────────────────────────
  goBack() {
    if (this.parentPostId) {
      this.router.navigate(['/post', this.parentPostId]);
    } else {
      this.router.navigate(['/feed']);
    }
  }

  // ── Filter ─────────────────────────────────────────────────
  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  selectFilter(filter: string) {
    this.activeFilter = filter;
    this.showFilterDropdown = false;
  }

  // ── Activity Modal ─────────────────────────────────────────
  openActivityModal() {
    this.showActivityModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeActivityModal() {
    this.showActivityModal = false;
    document.body.style.overflow = '';
  }

  toggleModalSortDropdown() {
    this.showModalSortDropdown = !this.showModalSortDropdown;
  }

  selectModalSort(sort: string) {
    this.activeModalSort = sort;
    this.showModalSortDropdown = false;
  }

  // ── Submit Reply ───────────────────────────────────────────
  submitReply() {
    if (!this.replyText.trim() || this.isSubmittingReply) return;

    this.isSubmittingReply = true;

    setTimeout(() => {
      const newReply: Reply = {
        id: 'reply_' + Date.now(),
        author: {
          id: 'me',
          name: 'Bạn',
          username: 'me',
          avatar: 'https://i.pravatar.cc/150?u=me_user',
          role: 'player',
        },
        type: 'general',
        typeLabel: 'Bình luận',
        time: 'Vừa xong',
        content: this.replyText.trim(),
        likes: 0,
        comments: 0,
        reposts: 0,
        shares: 0,
        isLiked: false,
        isReposted: false,
        replyTo: this.post?.id?.toString(),
      };

      this.replies = [newReply, ...this.replies];
      this.replyText = '';
      this.isSubmittingReply = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Đã đăng!',
        detail: 'Bình luận của bạn đã được đăng.',
        life: 2500,
      });
    }, 600);
  }

  // ── Nested Replies ─────────────────────────────────────────
  toggleNestedReplies(replyId: string) {
    if (this.expandedReplies.has(replyId)) {
      this.expandedReplies.delete(replyId);
    } else {
      this.expandedReplies.add(replyId);
    }
  }

  isReplyExpanded(replyId: string): boolean {
    return this.expandedReplies.has(replyId);
  }

  getNestedReplies(replyId: string): Reply[] {
    return this.nestedReplies[replyId] || [];
  }

  hasNestedReplies(replyId: string): boolean {
    return (this.nestedReplies[replyId]?.length ?? 0) > 0;
  }

  get replyCharCount(): number {
    return this.replyText.length;
  }

  get canSubmitReply(): boolean {
    return this.replyText.trim().length > 0 && !this.isSubmittingReply;
  }
}

