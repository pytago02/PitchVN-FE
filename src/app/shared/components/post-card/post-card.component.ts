import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { Popover, PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';
import { CarouselModule } from 'primeng/carousel';
import { GalleryModule } from 'primeng/gallery';

import { Replay } from '@primeicons/angular/replay';
import { Refresh } from '@primeicons/angular/refresh';
import { SearchPlus } from '@primeicons/angular/search-plus';
import { SearchMinus } from '@primeicons/angular/search-minus';
import { Times } from '@primeicons/angular/times';

import { Post, MOCK_USERS } from '../../../features/feed/mock-feed-data';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    PopoverModule,
    MenuModule,
    ToastModule,
    SharedModule,
    CarouselModule,
    GalleryModule,
    Replay, Refresh, SearchPlus, SearchMinus, Times
  ],
  providers: [MessageService],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post: any;
  @Input() isDetail: boolean = false;

  // ViewChild for overlay panels
  @ViewChild('repostPanel') repostPanel!: Popover;
  @ViewChild('sharePanel') sharePanel!: Popover;

  // Current user
  currentUser = MOCK_USERS['me'];

  // Local reactive state (copy of post data)
  isLiked = false;
  isReposted = false;
  likeCount = 0;
  repostCount = 0;
  commentCount = 0;

  // Like animation state
  likeAnimating = false;

  // Reply Dialog
  showReplyDialog = false;
  replyText = '';

  // More Menu items (PrimeNG)
  moreMenuItems: any[] = [];

  // Gallery preview state
  openGallery = false;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Initialize local state from post
    this.isLiked = this.post?.isLiked ?? false;
    this.isReposted = this.post?.isReposted ?? false;
    this.likeCount = this.post?.likes ?? 0;
    this.repostCount = this.post?.reposts ?? 0;
    this.commentCount = this.post?.comments ?? 0;

    // Build more menu
    this.buildMoreMenu();
  }

  goToDetail() {
    if (!this.isDetail && this.post?.id) {
      this.router.navigate(['/post', this.post.id]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  // ── Like ──────────────────────────────────────────────────
  toggleLike(event: Event) {
    event.stopPropagation();

    this.likeAnimating = true;
    setTimeout(() => (this.likeAnimating = false), 400);

    if (this.isLiked) {
      this.isLiked = false;
      this.likeCount = Math.max(0, this.likeCount - 1);
    } else {
      this.isLiked = true;
      this.likeCount++;
    }
  }

  // ── Gallery ───────────────────────────────────────────────
  activeGalleryIndex = 0;

  get activeGalleryImage(): string {
    return this.post?.images?.[this.activeGalleryIndex]?.url || '';
  }

  openGalleryPreview(event: Event, index: number) {
    event.stopPropagation();
    this.activeGalleryIndex = index;
    this.openGallery = true;
    document.body.style.overflow = 'hidden';
  }

  closeGallery() {
    this.openGallery = false;
    document.body.style.overflow = '';
  }

  prevGalleryImage(event: Event) {
    event.stopPropagation();
    if (this.post?.images && this.activeGalleryIndex > 0) {
      this.activeGalleryIndex--;
    }
  }

  nextGalleryImage(event: Event) {
    event.stopPropagation();
    if (this.post?.images && this.activeGalleryIndex < this.post.images.length - 1) {
      this.activeGalleryIndex++;
    }
  }

  // ── Reply ─────────────────────────────────────────────────
  openReplyDialog(event: Event) {
    event.stopPropagation();
    this.replyText = '';
    this.showReplyDialog = true;
  }

  closeReplyDialog() {
    this.showReplyDialog = false;
    this.replyText = '';
  }

  submitReply() {
    if (!this.replyText.trim()) return;
    this.commentCount++;
    this.closeReplyDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Đã đăng',
      detail: 'Bình luận của bạn đã được đăng!',
      life: 2500,
    });
  }

  // ── Repost ────────────────────────────────────────────────
  toggleRepostPanel(event: Event) {
    event.stopPropagation();
    this.repostPanel.toggle(event);
  }

  doRepost(event: Event) {
    event.stopPropagation();
    this.repostPanel.hide();

    if (this.isReposted) {
      this.isReposted = false;
      this.repostCount = Math.max(0, this.repostCount - 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Đã bỏ đăng lại',
        detail: 'Đã xóa bài đăng lại.',
        life: 2000,
      });
    } else {
      this.isReposted = true;
      this.repostCount++;
      this.messageService.add({
        severity: 'success',
        summary: 'Đã đăng lại',
        detail: 'Bài viết đã được đăng lại!',
        life: 2000,
      });
    }
  }

  doQuotePost(event: Event) {
    event.stopPropagation();
    this.repostPanel.hide();
    this.messageService.add({
      severity: 'info',
      summary: 'Trích dẫn',
      detail: 'Tính năng trích dẫn bài viết sẽ sớm ra mắt!',
      life: 2500,
    });
  }

  // ── Share ─────────────────────────────────────────────────
  toggleSharePanel(event: Event) {
    event.stopPropagation();
    this.sharePanel.toggle(event);
  }

  copyLink(event: Event) {
    event.stopPropagation();
    this.sharePanel.hide();
    const link = `https://pitchvn.com/post/${this.post?.id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Đã sao chép',
          detail: 'Đường dẫn đã được sao chép!',
          life: 2000,
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Đường dẫn',
          detail: link,
          life: 3000,
        });
      });
  }

  shareToFacebook(event: Event) {
    event.stopPropagation();
    this.sharePanel.hide();
    this.messageService.add({
      severity: 'info',
      summary: 'Chia sẻ Facebook',
      detail: 'Đang mở Facebook để chia sẻ...',
      life: 2000,
    });
  }

  shareToInstagram(event: Event) {
    event.stopPropagation();
    this.sharePanel.hide();
    this.messageService.add({
      severity: 'info',
      summary: 'Chia sẻ Instagram',
      detail: 'Tính năng chia sẻ Instagram sẽ sớm ra mắt!',
      life: 2000,
    });
  }

  // ── More Menu ─────────────────────────────────────────────
  private buildMoreMenu() {
    this.moreMenuItems = [
      {
        label: 'Lưu',
        icon: 'pi pi-bookmark',
        command: () => this.savePost(),
      },
      {
        label: 'Không quan tâm',
        icon: 'pi pi-eye-slash',
        command: () => this.notInterested(),
      },
      {
        label: 'Tắt thông báo',
        icon: 'pi pi-bell-slash',
        command: () => this.mutePost(),
      },
      {
        label: 'Sao chép liên kết',
        icon: 'pi pi-link',
        command: () => this.copyPostLink(),
      },
      { separator: true },
      {
        label: 'Báo cáo',
        icon: 'pi pi-flag',
        styleClass: 'menu-item-danger',
        command: () => this.reportPost(),
      },
    ];
  }

  private mutePost() {
    this.messageService.add({
      severity: 'info',
      summary: 'Đã tắt thông báo',
      detail: 'Bạn sẽ không nhận thông báo về bài viết này nữa.',
      life: 2000,
    });
  }

  private savePost() {
    this.messageService.add({
      severity: 'success',
      summary: 'Đã lưu',
      detail: 'Bài viết đã được lưu vào danh sách của bạn.',
      life: 2000,
    });
  }

  private copyPostLink() {
    const link = `https://pitchvn.com/post/${this.post?.id}`;
    navigator.clipboard.writeText(link).catch(() => { });
    this.messageService.add({
      severity: 'success',
      summary: 'Đã sao chép',
      detail: 'Đường dẫn đã được sao chép!',
      life: 2000,
    });
  }

  private notInterested() {
    this.messageService.add({
      severity: 'info',
      summary: 'Đã ghi nhận',
      detail: 'Bạn sẽ thấy ít bài viết dạng này hơn.',
      life: 2000,
    });
  }

  private reportPost() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Báo cáo',
      detail: 'Cảm ơn bạn! Chúng tôi sẽ xem xét bài viết này.',
      life: 2500,
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  formatCount(count: number): string {
    if (count >= 1000) return (count / 1000).toFixed(1).replace('.0', '') + 'k';
    return count > 0 ? count.toString() : '';
  }

  get hasMultipleImages(): boolean {
    return (this.post?.images?.length ?? 0) > 1;
  }

  get singleImage(): any {
    return this.post?.images?.[0] ?? null;
  }

  get multiImages(): any[] {
    return this.post?.images ?? [];
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
