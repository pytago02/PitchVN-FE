# 🎨 Hướng Dẫn Quy Chuẩn Giao Diện & Coding Style — PitchVN Frontend

> **Mục đích tài liệu**: Tài liệu này đóng vai trò là kim chỉ nam (Design System & UI Guidelines) dành cho lập trình viên và các AI coding assistant trong tương lai. Tất cả các tính năng, component và giao diện mới được phát triển cho dự án PitchVN **phải tuân thủ nghiêm ngặt** các quy tắc dưới đây để đảm bảo trải nghiệm người dùng (UX) và thẩm mỹ (UI) đồng nhất, chuẩn chỉnh theo phong cách **Threads.com**.

---

## 📌 1. Triết Lý Thiết Kế Tổng Quan (Design Philosophy)

- **Phong cách chủ đạo**: Tối giản, hiện đại, thanh thoát, tinh tế dựa trên ngôn ngữ thiết kế của **Threads.com (Instagram Threads)**.
- **Tính phản hồi tức thì (Optimistic UI)**: Các thao tác tương tác như Thích, Đăng lại, Lưu, Chuyển tab, Đăng bài viết phải phản hồi ngay lập tức trên UI trước khi nhận kết quả từ backend.
- **Hỗ trợ đa theme**: Toàn bộ ứng dụng hỗ trợ hoàn hảo cả 2 chế độ **Light Mode (Sáng)** và **Dark Mode (Tối)** với độ tương phản cao, êm mắt.
- **Kiến trúc công nghệ**: Angular Standalone Components kết hợp bộ UI component **PrimeNG (v22)** được custom CSS đồng bộ.

---

## 🔤 2. Typography & Phông Chữ

### Phông chữ chính
- Dự án sử dụng phông chữ **`Be Vietnam Pro`** (Google Fonts) hỗ trợ tiếng Việt sắc nét và hiện đại.
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

### Thang đo Typography (Design Tokens)
Được định nghĩa tập trung tại `src/styles.css`:

| Tên biến CSS | Kích thước (`font-size`) | Độ đậm (`font-weight`) | Chiều cao dòng (`line-height`) | Class tiện ích | Mục đích sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--display-3xl` | `28px` | `700` (Bold) | `36px` | - | Tiêu đề lớn trang chính |
| `--display-2xl` | `22px` | `700` (Bold) | `32px` | - | Tiêu đề khối / Section |
| `--heading-xl` | `18px` | `600` (SemiBold) | `28px` | `.heading-xl` | Tiêu đề header trang chi tiết |
| `--heading-lg` | `15px` | `600` (SemiBold) | `21px` | `.heading-lg` | Tên tác giả bài viết, tiêu đề modal, tab |
| `--body-md` | `15px` | `400` (Regular) | `21px` | `.body-md` | **Nội dung chính bài viết**, ô soạn thảo, bình luận |
| `--body-base` | `13px` | `400` (Regular) | `18px` | `.body-base` | Tên phụ, thông tin phụ trợ, mô tả |
| `--caption-sm` | `12px` | `400` / `500` | `18px` | `.caption-sm` | Thời gian, nhãn badge, số lượng ký tự, toggle |
| `--caption-xs` | `11px` | `400` (Regular) | `16px` | `.caption-xs` | Thời gian thu nhỏ, meta date |

> **Quy tắc**: Khi viết template HTML, ưu tiên sử dụng các class có sẵn như `class="heading-lg"`, `class="body-md"`, `class="caption-sm"` để đảm bảo đồng nhất font size và line-height.

---

## 🎨 3. Bảng Màu & Hệ Thống Biến Màu (Color Palette)

Tất cả màu sắc được cấu hình qua biến CSS trong `src/styles.css`. **Tuyệt đối không hardcode mã màu** trong file component CSS mà phải dùng biến `var(--...)`.

### Màu thương hiệu (Brand Color)
- **`--brand-primary: #85EA2D;`** (Xanh lá vôi PitchVN): Sử dụng cho logo, điểm nhấn thương hiệu, badge sân trống, trạng thái Reposted.

### Bảng màu theo Theme:

| Tên biến CSS | Chế độ Sáng (Light Mode) | Chế độ Tối (Dark Mode) | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `--surface-bg` | `#FFFFFF` | `#101010` | Nền toàn trang, nền modal/dialog |
| `--card-bg` | `#FFFFFF` | `#101010` (hoặc `#181818`) | Nền popup menu, popover, floating cards |
| `--nav-bg` | `rgba(255, 255, 255, 0.85)` | `rgba(16, 16, 16, 0.85)` | Nền thanh tab, header cố định có `backdrop-filter: blur(12px)` |
| `--text-primary` | `#000000` | `#FFFFFF` | Tiêu đề, tên người dùng, nội dung chính |
| `--text-secondary` | `#000000` | `#FFFFFF` | Nội dung phụ, liên kết |
| `--text-tertiary` | `#737373` | `#8E8E8E` | Thời gian, icon chưa chọn, placeholder |
| `--border-color` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.15)` | Đường phân cách bài viết, viền popup, divider |
| `--thread-line-color` | `#E5E5E5` | `#333333` | **Đường line dọc kết nối avatar các bài viết/bình luận** |
| `--danger` | `#FF3040` | `#FF3040` | Nút Like khi đã thích, nút Báo cáo, Đăng xuất |

### Màu thanh điều hướng (Navbar Tokens):

| Biến CSS | Light Mode | Dark Mode | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `--nav-item-color` | `#737373` | `#8E8E8E` | Màu chữ & icon mục chưa chọn |
| `--nav-item-hover-color` | `#000000` | `#FFFFFF` | Màu chữ & icon khi rê chuột (hover) |
| `--nav-item-hover-bg` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.12)` | Màu nền khi rê chuột |
| `--nav-item-active-color` | `#000000` | `#FFFFFF` | Màu chữ & icon mục đang chọn (in đậm) |
| `--nav-item-active-bg` | `rgba(0, 0, 0, 0.10)` | `rgba(255, 255, 255, 0.20)` | Màu nền pill mục đang chọn |

### Màu Badges Loại Bài Viết:
- **`available_slot` (Lịch trống)**: Chữ màu `--brand-primary` (`#85EA2D`), viền cùng màu, nền `rgba(133, 234, 45, 0.08)`.
- **`challenge` (Kèo đấu)**: Chữ màu `--danger` (`#FF3040`), viền cùng màu, nền `rgba(239, 68, 68, 0.08)`.
- **`tournament` (Giải đấu)**: Chữ màu cam `#F59E0B`, viền `#F59E0B`, nền `rgba(245, 158, 11, 0.08)`.
- **`recruitment` (Tuyển quân)**: Chữ màu tím `#8B5CF6`, viền `#8B5CF6`, nền `rgba(139, 92, 246, 0.08)`.
- **`general` (Tin tức / Bình luận)**: Không viền, màu `--text-tertiary`.

---

## 🔲 4. Quy Chuẩn Bo Góc (Border Radius System)

Giao diện Threads sử dụng ngôn ngữ bo tròn mềm mại và nhất quán:

| Kích thước bo góc | Đối tượng áp dụng | Ví dụ |
| :--- | :--- | :--- |
| **`50%` (Hình tròn)** | Avatar người dùng, icon nút bấm tròn | `.thread-avatar`, `.create-avatar`, `.back-btn` |
| **`20px` (Dạng viên thuốc - Pill)** | Nút Đăng bài, nút CTA ("Đặt ngay", "Xem chi tiết"), Badges thể loại, Modal Compose/Reply | `.compose-post-btn`, `.badge`, `.custom-compose-dialog` |
| **`16px`** | Menu Popup nổi (Popover), Hộp thoại chọn tùy chọn, nút FAB nổi ở góc màn hình | `p-popover`, `.fab-btn`, `.custom-more-menu` |
| **`12px - 14px`** | Hình ảnh bài viết đơn, Grid ảnh, Item trong Menu, Nav item trên sidebar | `.media-single`, `.media-grid`, `.nav-item`, `.more-menu-item` |
| **`8px - 10px`** | Dropdown items nhỏ, nút Theo dõi | `.dropdown-item`, `.follow-btn` |

---

## 📐 5. Cấu Trúc Bố Cục & Responsive (Layout Grid)

```
┌────────────────────────────────────────────────────────────────────────┐
│  DESKTOP LAYOUT (>= 1024px)                                            │
│ ┌───────────────┬───────────────────────────────┬───────────────────┐  │
│ │               │        FEED CONTAINER         │                   │  │
│ │    SIDEBAR    │       (Max-width: 620px)      │      (Trống /     │  │
│ │   (W: 260px)  │   - Sticky Header Tabs        │      Right col)   │  │
│ │  - Logo       │   - Create Post Trigger       │                   │  │
│ │  - Nav items  │   - Post Card Stream          │                   │  │
│ │  - Xem thêm   │   - Nested Comments Tree      │                   │  │
│ └───────────────┴───────────────────────────────┴───────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Desktop (>= 1024px)**:
  - Sidebar cố định bên trái (`position: fixed; width: 260px; padding: 24px`).
  - Cột chính căn giữa màn hình với `max-width: 620px; margin: 0 auto`.
  - Nút soạn thảo nhanh FAB ở góc dưới bên phải (`right: 32px; bottom: 32px`).
- **Tablet (768px - 1023px)**:
  - Sidebar thu nhỏ còn `80px`, ẩn text menu, chỉ hiển thị icon căn giữa.
  - Main content dịch sang lề trái `margin-left: 80px; width: calc(100% - 80px)`.
- **Mobile (< 768px)**:
  - Ẩn hoàn toàn sidebar bên trái.
  - Hiển thị **Bottom Tab Bar** cố định dưới đáy màn hình (`height: 60px; z-index: 1000; background: var(--nav-bg); backdrop-filter: blur(8px)`).
  - Main content mở rộng `width: 100%`, thêm `padding-bottom: 70px`.
  - Các Dialog soạn bài / trả lời tự động chuyển thành **Bottom Sheet** (chiếm 100% chiều rộng, dính đáy, bo tròn 2 góc trên `20px 20px 0 0`).

---

## 🧵 6. Cấu Trúc Post Card & Đường Line Luồng Bình Luận (Thread Tree)

Mỗi bài viết hoặc bình luận đều được xây dựng theo cấu trúc 2 cột đặc trưng của Threads:

```html
<article class="thread-post">
  <!-- Cột trái: Avatar + Thread Line nối xuống dưới -->
  <div class="thread-left">
    <img class="thread-avatar" [src]="post.author.avatar" />
    <div class="thread-line"></div> <!-- Nối tiếp tới các reply con -->
  </div>

  <!-- Cột phải: Nội dung + Media + Action buttons -->
  <div class="thread-right">
    <!-- Header: Tác giả, Tick xanh, Badge, Thời gian, Nút '...' -->
    <div class="thread-header">...</div>

    <!-- Body: Text + Media Single/Grid -->
    <div class="thread-body">...</div>

    <!-- Actions: Like, Reply, Repost, Share -->
    <div class="thread-actions">...</div>
  </div>
</article>
```

### Bộ 4 nút tương tác (Action Buttons):
1. **❤️ Thích (Like)**:
   - Trạng thái chưa thích: icon viền xám `var(--text-secondary)`.
   - Trạng thái đã thích: icon đầy màu đỏ `var(--danger)` kèm animation nhịp tim (heartbeat `@keyframes`).
2. **💬 Trả lời (Reply)**:
   - Mở dialog trả lời (`p-dialog` style headless) kèm bản trích dẫn bài gốc.
3. **🔁 Đăng lại (Repost)**:
   - Mở `p-popover` gồm: *Đăng lại* và *Trích dẫn*.
   - Khi đã đăng lại: icon chuyển màu xanh `var(--brand-primary)`.
4. **📤 Chia sẻ (Share)**:
   - Mở `p-popover` gồm: *Sao chép liên kết*, *Chia sẻ lên Facebook*, *Chia sẻ lên Instagram*.

---

## 🧩 7. Quy Chuẩn Tích Hợp PrimeNG (v22)

Dự án sử dụng **PrimeNG phiên bản 22** với các component chính:

### 1. `p-dialog` (Dùng cho Compose & Reply Modal)
- **Cấu hình Template**: Luôn sử dụng `<ng-template #headless>` để tự kiểm soát 100% layout Header, Body, Footer chuẩn Threads, tránh dùng header mặc định của PrimeNG:
  ```html
  <p-dialog
    [(visible)]="showDialog"
    [modal]="true"
    [draggable]="false"
    [resizable]="false"
    [showHeader]="false"
    styleClass="custom-compose-dialog"
    [dismissableMask]="true"
    maskStyleClass="custom-modal-mask"
    appendTo="body"
  >
    <ng-template #headless>
      <div class="compose-dialog-inner">
        <!-- Tự định nghĩa Header, Content, Footer -->
      </div>
    </ng-template>
  </p-dialog>
  ```
- **Mask Background**: `background-color: rgba(0, 0, 0, 0.65); backdrop-filter: blur(3px);`.

### 2. `p-popover` (Dùng cho Repost, Share, More Menu)
- **Cấu hình**: `appendTo="body"`, bo góc `16px`, nền `var(--card-bg)`, shadow `0 10px 40px rgba(0, 0, 0, 0.45)`.
- Ẩn mũi tên trỏ bằng CSS:
  ```css
  ::ng-deep .custom-popover.p-popover::before,
  ::ng-deep .custom-popover.p-popover::after {
    display: none !important;
  }
  ```

### 3. `p-menu` (Dùng cho menu tùy chọn `...`)
- **Cấu trúc Menu Item PrimeNG v22**:
  - Class name item link: `.p-menu-item-link`
  - Class name item label: `.p-menu-item-label` (nằm bên trái `order: 1`)
  - Class name item icon: `.p-menu-item-icon` (nằm bên phải `order: 2`)
  - Mục nguy hiểm / cảnh báo: Gán `styleClass: 'menu-item-danger'` (đổi màu chữ và icon sang `var(--danger)`).

---

## 📁 8. Quy Chuẩn Tổ Chức Code & Mock Data

1. **Dữ liệu Mock**:
   - Tất cả dữ liệu giả lập phải được gom tập trung vào file `mock-feed-data.ts` (hoặc `mock-*.data.ts` tương ứng theo từng feature).
   - Phải có đầy đủ TypeScript Interfaces (`Post`, `Reply`, `PostUser`, `PostAction`).
   - Mock đầy đủ các trường hợp: bài có 1 ảnh, nhiều ảnh, không ảnh, bài có nút CTA, bình luận lồng nhau 2 cấp.

2. **Angular Standalone Components**:
   - Mọi component mới đều là **Standalone Component** (`standalone: true`).
   - Khai báo đầy đủ các module cần thiết trong mảng `imports: [...]` (ví dụ: `CommonModule`, `FormsModule`, `RouterModule`, `DialogModule`, `PopoverModule`, `SharedModule`).
   - `provideAnimationsAsync()` đã được cấu hình trong `src/app/app.config.ts`, không cần cấu hình lại.

3. **Cấu trúc thư mục**:
   ```
   src/app/
   ├── core/                    # Services dùng chung, interceptors, guards
   ├── layout/                  # Layout chính (player-layout, admin-layout)
   ├── features/                # Các trang tính năng độc lập
   │   ├── feed/                # Trang Bảng tin chính
   │   │   ├── mock-feed-data.ts
   │   │   ├── feed.component.ts
   │   │   ├── feed.component.html
   │   │   └── feed.component.css
   │   └── post-detail/         # Trang chi tiết bài viết & luồng bình luận
   │       ├── post-detail.component.ts
   │       ├── post-detail.component.html
   │       └── post-detail.component.css
   └── shared/                  # Components, pipes, directives dùng chung
       └── components/
           └── post-card/       # Component thẻ bài viết Threads dùng chung
   ```

---

## ✅ 9. Checklist Kiểm Thử Giao Diện Khi Tạo Tính Năng Mới

Trước khi hoàn thành một màn hình/component mới, hãy tự kiểm tra theo checklist sau:

- [ ] Giao diện đã có độ tương phản và màu sắc rõ ràng trên cả **Light Mode** và **Dark Mode**?
- [ ] Các góc bo đã tuân thủ đúng quy chuẩn (`12px`, `16px`, `20px`, `50%`) chưa?
- [ ] Font chữ có đang sử dụng đúng các class typography (`.heading-lg`, `.body-md`, `.caption-sm`) không?
- [ ] Hiệu ứng hover / active trên các nút bấm và liên kết có mượt mà (`transition: all 0.15s ease`) không?
- [ ] Trên màn hình Mobile (< 768px), giao diện có co giãn mượt mà và các popup có hiển thị dạng bottom sheet thuận tiện không?
- [ ] Không có mã màu nào bị hardcode trực tiếp mà toàn bộ đều dùng biến CSS (`var(--...)`)?
