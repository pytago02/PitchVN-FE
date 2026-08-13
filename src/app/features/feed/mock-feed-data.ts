// ============================================================
// INTERFACES — Định nghĩa kiểu dữ liệu
// ============================================================

export interface PostUser {
  id: string;
  name: string;         // Tên hiển thị
  username: string;     // @handle
  avatar: string;
  verified?: boolean;   // Tick xanh
  role?: 'player' | 'pitch_owner' | 'admin'; // Vai trò PitchVN
}

export interface PostImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface PostAction {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

export type PostType = 'general' | 'available_slot' | 'challenge' | 'tournament' | 'recruitment';

export interface Post {
  id: string | number;
  author: PostUser;
  type: PostType;
  typeLabel: string;
  time: string;           // Hiển thị (e.g. "2 giờ trước")
  content: string;
  images?: PostImage[];
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  views?: number;
  isLiked?: boolean;      // Trạng thái đã thích
  isReposted?: boolean;   // Trạng thái đã repost
  isSaved?: boolean;      // Trạng thái đã lưu
  action?: PostAction;    // Nút CTA (Đặt ngay, Thách đấu...)
  repostOf?: Post;        // Nếu là bài repost
  quotedPost?: Post;      // Nếu là quote post
  location?: string;      // Địa điểm (tuỳ chọn)
}

export interface Reply extends Post {
  replyTo?: string;       // ID của post hoặc reply đang trả lời
  replies?: Reply[];      // Sub-replies (nested)
}

// ============================================================
// MOCK USERS — Người dùng mẫu
// ============================================================

export const MOCK_USERS: Record<string, PostUser> = {
  me: {
    id: 'me',
    name: 'Bạn',
    username: 'me',
    avatar: 'https://i.pravatar.cc/150?u=me_user',
    role: 'player',
  },
  vana: {
    id: 'u1',
    name: 'Nguyễn Văn A',
    username: 'nguyenvana',
    avatar: 'https://i.pravatar.cc/150?u=u1',
    role: 'player',
  },
  chaolua: {
    id: 'u2',
    name: 'Sân Chảo Lửa',
    username: 'sanchaolua',
    avatar: 'https://i.pravatar.cc/150?u=u2',
    verified: true,
    role: 'pitch_owner',
  },
  baotap: {
    id: 'u3',
    name: 'FC Bão Táp',
    username: 'fcbaotap',
    avatar: 'https://i.pravatar.cc/150?u=u3',
    role: 'player',
  },
  ngoisan: {
    id: 'u4',
    name: 'Ngôi sao sân cỏ',
    username: 'ngoisan',
    avatar: 'https://i.pravatar.cc/150?u=u4',
    role: 'player',
  },
  trongtai: {
    id: 'u5',
    name: 'Trọng tài Quang',
    username: 'trongtaiquang',
    avatar: 'https://i.pravatar.cc/150?u=u5',
    verified: true,
    role: 'admin',
  },
  admin: {
    id: 'admin',
    name: 'PitchVN Official',
    username: 'pitchvn',
    avatar: 'https://i.pravatar.cc/150?u=admin_pitchvn',
    verified: true,
    role: 'admin',
  },
  hungthanhh: {
    id: 'u6',
    name: 'Thanh Hùng',
    username: 'hungthanhh',
    avatar: 'https://i.pravatar.cc/150?u=u6',
    role: 'player',
  },
  vanquyet: {
    id: 'u7',
    name: 'Văn Quyết',
    username: 'vanquyet10',
    avatar: 'https://i.pravatar.cc/150?u=u7',
    role: 'player',
  },
  baotram: {
    id: 'u8',
    name: 'Bảo Trâm',
    username: 'baotram',
    avatar: 'https://i.pravatar.cc/150?u=u8',
    role: 'player',
  },
  sontienve: {
    id: 'u9',
    name: 'Sơn Tiền Vệ',
    username: 'son_midfield',
    avatar: 'https://i.pravatar.cc/150?u=u9',
    role: 'player',
  },
  huyfc: {
    id: 'u10',
    name: 'Huy FC',
    username: 'huyfc99',
    avatar: 'https://i.pravatar.cc/150?u=u10',
    role: 'player',
  },
};

// ============================================================
// MOCK FEED — Tab "Cho bạn" (For You)
// ============================================================

export const MOCK_FEED: Post[] = [
  // --- Post 1: Bài tổng hợp có ảnh ---
  {
    id: '1',
    author: MOCK_USERS['vana'],
    type: 'general',
    typeLabel: 'Tin tức',
    time: '2 giờ trước',
    content:
      'Hôm nay đá vui quá anh em ơi! Trận với FC Sông Trà kịch tính lắm, tỉ số 3-2 đúng phút chót 😤⚽\n\nCảm ơn sân bóng ABC đã hỗ trợ anh em một sân đẹp và mặt cỏ xịn. Anh em nào cần đặt sân cuối tuần thì nhắn mình nhé!',
    images: [
      {
        url: 'https://placehold.co/600x400/1a1a2e/85EA2D?text=FC+Song+Tra+vs+Bao+Tap',
        alt: 'Trận đấu FC Sông Trà',
      },
    ],
    likes: 47,
    comments: 12,
    reposts: 5,
    shares: 3,
    views: 1204,
    isLiked: false,
    isReposted: false,
  },
  // --- Post 2: Sân trống — CTA Đặt ngay ---
  {
    id: '2',
    author: MOCK_USERS['chaolua'],
    type: 'available_slot',
    typeLabel: 'Lịch trống',
    time: '5 giờ trước',
    content:
      '🟢 SÂN TRỐNG TỐI NAY!\n\nSân 7 người còn khung 19:00 – 20:30. Mặt cỏ nhân tạo 5 sao, có mái che, bãi xe rộng.\n\nĐội nào cần giao lưu hoặc đặt sân thì comment hoặc inbox ngay nhé!',
    images: [],
    likes: 18,
    comments: 7,
    reposts: 12,
    shares: 8,
    views: 892,
    isLiked: false,
    isReposted: false,
    action: {
      label: 'Đặt ngay',
      variant: 'primary',
    },
    location: 'Sân Chảo Lửa, Cầu Giấy, Hà Nội',
  },
  // --- Post 3: Tìm kèo — CTA Thách đấu ---
  {
    id: '3',
    author: MOCK_USERS['baotap'],
    type: 'challenge',
    typeLabel: 'Tìm kèo',
    time: '1 ngày trước',
    content:
      'FC Bão Táp đang tìm đối mềm khu vực Cầu Giấy – Từ Liêm, tối mai (thứ 6), khung 20:00–21:30.\n\n📋 Trình: hạng D/E\n👥 Sân 7 người\n📍 Khu vực: Cầu Giấy\n\nAe nào có kèo để lại comment bên dưới hoặc inbox page nhé 🙏',
    images: [],
    likes: 64,
    comments: 28,
    reposts: 14,
    shares: 9,
    views: 2310,
    isLiked: true,
    isReposted: false,
    action: {
      label: 'Thách đấu',
      variant: 'secondary',
    },
  },
  // --- Post 4: Official PitchVN — Nhiều ảnh ---
  {
    id: '4',
    author: MOCK_USERS['admin'],
    type: 'tournament',
    typeLabel: 'Giải đấu',
    time: '3 ngày trước',
    content:
      '🏆 GIẢI BÓNG ĐÁ SINH VIÊN PITCHVN CUP 2025\n\nChính thức mở đăng ký! Đây là giải đấu dành riêng cho các đội bóng sinh viên trên toàn quốc.\n\n📅 Thời gian: 15/08 – 20/09/2025\n🏅 Giải thưởng: Cúp + 10.000.000 VNĐ\n📝 Điều kiện: Có thẻ sinh viên hợp lệ\n\nĐăng ký ngay để không bỡ cơ hội!',
    images: [
      {
        url: 'https://placehold.co/600x300/0f3460/e94560?text=PitchVN+Cup+2025',
        alt: 'PitchVN Cup 2025 Banner',
      },
      {
        url: 'https://placehold.co/300x300/16213e/e94560?text=Giai+Thuong+10M',
        alt: 'Giải thưởng 10 triệu',
      },
    ],
    likes: 312,
    comments: 87,
    reposts: 145,
    shares: 201,
    views: 15890,
    isLiked: false,
    isReposted: false,
    action: {
      label: 'Đăng ký ngay',
      variant: 'primary',
    },
  },
  // --- Post 5: Chiêu mộ cầu thủ ---
  {
    id: '5',
    author: MOCK_USERS['huyfc'],
    type: 'recruitment',
    typeLabel: 'Tuyển quân',
    time: '4 ngày trước',
    content:
      'FC Thiên Lôi đang cần thêm 2 cầu thủ cho mùa giải mới!\n\n✅ Vị trí: Tiền vệ trung tâm + Thủ môn\n✅ Trình độ: hạng C/D\n✅ Tập luyện: Thứ 4 & Thứ 7 tối tại Hoàng Mai\n✅ Có phí đội (500k/tháng)\n\nAe quan tâm DM mình nhé 💪',
    images: [],
    likes: 23,
    comments: 11,
    reposts: 4,
    shares: 2,
    views: 560,
    isLiked: false,
    isReposted: false,
  },
  // --- Post 6: Tin tức không có ảnh ---
  {
    id: '6',
    author: MOCK_USERS['trongtai'],
    type: 'general',
    typeLabel: 'Thông báo',
    time: '5 ngày trước',
    content:
      'Lưu ý quan trọng cho giải phong trào cuối tuần này:\n\n⚠️ KHÔNG được mang giày đinh sắt (chỉ dùng đinh nhựa hoặc đế bằng)\n⚠️ Bắt buộc có áo đấu có số\n⚠️ Đến trễ quá 10 phút sẽ bị tính thua\n\nQuy định áp dụng từ vòng 3. Anh em lưu ý nhé!',
    images: [],
    likes: 189,
    comments: 42,
    reposts: 67,
    shares: 34,
    views: 7230,
    isLiked: true,
    isReposted: true,
  },
];

// ============================================================
// MOCK FOLLOWING FEED — Tab "Đang theo dõi"
// ============================================================

export const MOCK_FOLLOWING_FEED: Post[] = [
  {
    id: '101',
    author: MOCK_USERS['ngoisan'],
    type: 'general',
    typeLabel: 'Tin tức',
    time: '15 phút trước',
    content:
      'Vừa có trận thắng kịch tính 3-2 trước FC Sông Trà! Cảm ơn anh em đã thi đấu hết mình. Bàn thắng phút 89 của Hùng Lực cảm xúc lắm 🔥🔥🔥',
    images: [
      {
        url: 'https://placehold.co/600x400/0d1b2a/85EA2D?text=Chien+Thang+3-2',
        alt: 'Chiến thắng 3-2',
      },
    ],
    likes: 98,
    comments: 24,
    reposts: 8,
    shares: 5,
    views: 2140,
    isLiked: false,
    isReposted: false,
  },
  {
    id: '102',
    author: MOCK_USERS['trongtai'],
    type: 'general',
    typeLabel: 'Luật chơi',
    time: '2 giờ trước',
    content:
      'Luật mới áp dụng cho giải phong trào cuối tuần này nhé mọi người, lưu ý không mang giày đinh sắt và phải có áo đội đầy đủ.\n\nBất kỳ ai vi phạm sẽ bị truất quyền thi đấu ngay lập tức.',
    images: [],
    likes: 156,
    comments: 48,
    reposts: 22,
    shares: 18,
    views: 5420,
    isLiked: false,
    isReposted: false,
  },
  {
    id: '103',
    author: MOCK_USERS['chaolua'],
    type: 'available_slot',
    typeLabel: 'Lịch trống',
    time: '6 giờ trước',
    content:
      'Cuối tuần này sân vẫn còn khung sáng (6:00–8:00) và tối (21:00–22:30) trống. Anh em nào cần book thì liên hệ sớm nhé, ưu tiên đặt trước!',
    images: [],
    likes: 12,
    comments: 3,
    reposts: 6,
    shares: 4,
    views: 340,
    isLiked: false,
    isReposted: false,
    action: {
      label: 'Đặt ngay',
      variant: 'primary',
    },
  },
];

// ============================================================
// MOCK REPLIES — Bình luận & Sub-replies (2 cấp)
// ============================================================

export const MOCK_REPLIES: Record<string, Reply[]> = {
  // Replies của Post 1
  '1': [
    {
      id: 'r1',
      author: MOCK_USERS['hungthanhh'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '1 giờ trước',
      content: 'Cho mình xin một slot đá giao lưu nhé! Đội mình cũng đang cần thêm kèo đây 💪',
      likes: 5,
      comments: 2,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '1',
    },
    {
      id: 'r2',
      author: MOCK_USERS['vanquyet'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '45 phút trước',
      content: 'Đội mình còn thiếu thủ môn cho cuối tuần này không anh? Chất lượng khá ổn 😄',
      likes: 3,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: true,
      isReposted: false,
      replyTo: '1',
    },
    {
      id: 'r3',
      author: MOCK_USERS['vana'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '30 phút trước',
      content: '@vanquyet10 Oke bạn, inbox mình số điện thoại đi để mình kết nối nhé!',
      likes: 2,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r2',
    },
  ],

  // Replies của Post 2 (Sân trống)
  '2': [
    {
      id: 'r4',
      author: MOCK_USERS['baotram'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '4 giờ trước',
      content: 'Giá thuê sân 7 người khung 19:00 bao nhiêu anh ơi?',
      likes: 8,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '2',
    },
    {
      id: 'r5',
      author: MOCK_USERS['huyfc'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '3 giờ trước',
      content: 'Có hỗ trợ đặt cọc online không sân? Hay phải trả tiền mặt tại chỗ?',
      likes: 4,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '2',
    },
  ],

  // Replies của Post 3 (Tìm kèo)
  '3': [
    {
      id: 'r6',
      author: MOCK_USERS['sontienve'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '20 giờ trước',
      content:
        'FC Rồng Xanh trình C muốn đá thử được không? Tụi mình khu Đống Đa nhưng di chuyển được 👌',
      likes: 15,
      comments: 2,
      reposts: 0,
      shares: 0,
      isLiked: true,
      isReposted: false,
      replyTo: '3',
    },
    {
      id: 'r7',
      author: MOCK_USERS['baotap'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '18 giờ trước',
      content: '@son_midfield Trình C hơi cao so với tụi mình, nhưng nếu bạn có thể kéo xuống một chút thì ok!',
      likes: 6,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r6',
    },
    {
      id: 'r8',
      author: MOCK_USERS['ngoisan'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '15 giờ trước',
      content: 'FC Ngôi Sao sân Từ Liêm, trình D, sẵn sàng cho kèo tối thứ 6. Inbox nhé bro!',
      likes: 21,
      comments: 0,
      reposts: 1,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '3',
    },
  ],

  // Replies của Post 4 (Giải đấu)
  '4': [
    {
      id: 'r9',
      author: MOCK_USERS['baotram'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '2 ngày trước',
      content: 'Giải này có bắt buộc thẻ sinh viên không admin? Hay có thể dùng giấy xác nhận của trường?',
      likes: 12,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '4',
    },
    {
      id: 'r10',
      author: MOCK_USERS['admin'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '2 ngày trước',
      content:
        '@baotram Bắt buộc thẻ sinh viên còn hiệu lực hoặc giấy xác nhận có đóng dấu của trường nhé bạn! Để đảm bảo tính công bằng.',
      likes: 34,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: true,
      isReposted: false,
      replyTo: 'r9',
    },
    {
      id: 'r11',
      author: MOCK_USERS['huyfc'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '1 ngày trước',
      content:
        'Số đội tham dự tối đa là bao nhiêu? Đăng ký muộn có bị loại không?',
      likes: 7,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '4',
    },
  ],

  // Replies của Post 5 (Tuyển quân)
  '5': [
    {
      id: 'r12',
      author: MOCK_USERS['sontienve'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '3 ngày trước',
      content:
        'Mình đá tiền vệ trung tâm trình D, sẵn sàng thử việc. Đã có 3 năm kinh nghiệm giải phong trào!',
      likes: 9,
      comments: 1,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: '5',
    },
    {
      id: 'r13',
      author: MOCK_USERS['vanquyet'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '3 ngày trước',
      content: 'Thủ môn trình D/C đây nhé. Chiều cao 1m80, phản xạ tốt 🧤',
      likes: 14,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: true,
      isReposted: false,
      replyTo: '5',
    },
  ],

  // Nested sub-replies (cấp 2)
  'r1': [
    {
      id: 'r1_1',
      author: MOCK_USERS['sontienve'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '50 phút trước',
      content: '@hungthanhh Bác đá cánh hay đá trung tâm thế? Tụi mình cũng đang cần thêm người 😄',
      likes: 2,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r1',
    },
    {
      id: 'r1_2',
      author: MOCK_USERS['hungthanhh'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '40 phút trước',
      content: '@son_midfield Mình đá tiền đạo bác ơi, nhưng cánh cũng được nha!',
      likes: 1,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r1',
    },
  ],

  'r4': [
    {
      id: 'r4_1',
      author: MOCK_USERS['chaolua'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '3 giờ trước',
      content:
        '@baotram Sân 7 người giờ vàng tối (19:00–21:00) là 450k/giờ bạn nhé! Các khung khác 350k/giờ.',
      likes: 5,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r4',
    },
  ],

  'r6': [
    {
      id: 'r6_1',
      author: MOCK_USERS['baotap'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '17 giờ trước',
      content: 'FC Rồng Xanh ok nha! Inbox mình địa điểm sân tụi mình hay đá để đánh giá 👍',
      likes: 8,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r6',
    },
  ],

  'r9': [
    {
      id: 'r9_1',
      author: MOCK_USERS['admin'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '2 ngày trước',
      content:
        'Bắt buộc thẻ sinh viên còn hiệu lực hoặc giấy xác nhận có đóng dấu của trường nhé! Để đảm bảo tính công bằng của giải.',
      likes: 34,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: true,
      isReposted: false,
      replyTo: 'r9',
    },
  ],

  'r12': [
    {
      id: 'r12_1',
      author: MOCK_USERS['huyfc'],
      type: 'general',
      typeLabel: 'Bình luận',
      time: '2 ngày trước',
      content: '@son_midfield Bạn có thể đến buổi thử việc tối thứ 4 không? Sân Hoàng Mai, 20:00',
      likes: 3,
      comments: 0,
      reposts: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      replyTo: 'r12',
    },
  ],
};
