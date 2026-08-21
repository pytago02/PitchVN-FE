import { Post } from '../feed/mock-feed-data';

export interface PlayerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  preferredPosition: 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo' | 'Linh hoạt';
  preferredFoot: 'Trái' | 'Phải' | 'Hai chân';
  isPrivate: boolean;
  province: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    instagram?: string;
  };
  stats: {
    matches: number;
    won: number;
    drawn: number;
    lost: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    elo: number;
    rankTier: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    winRate: number;
  };
  eloHistory: number[]; // ELO history over last 10 matches
}

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or SVG key
  color: string;
  earnedAt: string;
}

export const MOCK_PROFILE: PlayerProfile = {
  id: 'p2',
  name: 'Phạm Tuấn Hải',
  handle: 'tuanhai.pham',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
  bio: 'Cầu thủ đá cánh / Tiền đạo cắm. Đam mê bóng đá phủi Hà Nội. Cựu tuyển thủ phong trào FC Thành Đồng. ⚽🔥',
  followersCount: 1420,
  followingCount: 382,
  preferredPosition: 'Tiền đạo',
  preferredFoot: 'Phải',
  isPrivate: false,
  province: 'Hà Nội',
  socialLinks: {
    facebook: 'https://facebook.com/tuanhai.pham',
    instagram: 'https://instagram.com/tuanhai.pham',
    zalo: '0987654321'
  },
  stats: {
    matches: 42,
    won: 31,
    drawn: 6,
    lost: 5,
    goals: 38,
    assists: 17,
    yellowCards: 2,
    redCards: 0,
    elo: 2080,
    rankTier: 'S',
    winRate: 74
  },
  eloHistory: [1920, 1940, 1930, 1960, 1990, 1980, 2010, 2040, 2070, 2080]
};

const profileAuthor = {
  id: MOCK_PROFILE.id,
  name: MOCK_PROFILE.name,
  username: MOCK_PROFILE.handle,
  avatar: MOCK_PROFILE.avatar,
  verified: true,
  role: 'player' as const,
};

export const MOCK_PROFILE_POSTS: Post[] = [
  {
    id: 'post_p1',
    author: profileAuthor,
    type: 'general',
    typeLabel: 'Kết quả',
    time: '2 ngày trước',
    content: 'Chiến thắng nghẹt thở 4-3 trước FC Cường Quốc tối nay! Mình may mắn lập được một hat-trick và 1 kiến tạo. Trận đấu cực kỳ chất lượng, đúng nghĩa Siêu phủi Hà Nội. Cảm ơn anh em đã chiến đấu hết mình! 🏆⚽',
    images: [
      { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80', alt: 'Trận đấu 1' },
      { url: 'https://images.unsplash.com/photo-1543326301-88543b53fa5e?w=600&auto=format&fit=crop&q=80', alt: 'Trận đấu 2' }
    ],
    likes: 128,
    comments: 24,
    reposts: 5,
    shares: 8,
    views: 890,
    isLiked: true,
    isReposted: false
  },
  {
    id: 'post_p2',
    author: profileAuthor,
    type: 'challenge',
    typeLabel: 'Tìm kèo',
    time: '5 ngày trước',
    content: 'Cần tìm kèo sân 7 Hà Đông, tối thứ 6 tuần này (khung giờ 19h - 20h30). Trình độ đội ở mức Khá-Chuyên nghiệp (Hạng B/A). Đội mình nhận chia tiền sân nước 50/50 nhẹ nhàng giao lưu. Ai có kèo liên hệ nhé!',
    images: [],
    likes: 45,
    comments: 12,
    reposts: 2,
    shares: 0,
    views: 450,
    isLiked: false,
    isReposted: false
  },
  {
    id: 'post_p3',
    author: profileAuthor,
    type: 'general',
    typeLabel: 'Tin tức',
    time: '1 tuần trước',
    content: 'Mới tậu đôi giày mới để chiến giải phủi HPL sắp tới. Cảm giác ôm chân cực kỳ, sút bóng đầm tay hẳn. Anh em nào cần review chi tiết dòng này thì comment bên dưới nhé! 👟⚽',
    images: [
      { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80', alt: 'Giày mới' }
    ],
    likes: 92,
    comments: 31,
    reposts: 1,
    shares: 2,
    views: 720,
    isLiked: false,
    isReposted: true
  }
];

export const MOCK_ACHIEVEMENTS: ProfileAchievement[] = [
  {
    id: 'ach_1',
    title: 'Huyền thoại ELO',
    description: 'Đạt mốc ELO siêu cấp ≥ 2000 (Hạng S)',
    icon: '👑',
    color: '#EF9F27',
    earnedAt: '12/07/2026'
  },
  {
    id: 'ach_2',
    title: 'Kẻ hủy diệt',
    description: 'Ghi được 3 bàn thắng trong một trận đấu (Hat-trick)',
    icon: '🔥',
    color: '#FF3040',
    earnedAt: '18/08/2026'
  },
  {
    id: 'ach_3',
    title: 'Chuỗi bất bại',
    description: 'Sở hữu chuỗi 10 trận thắng liên tiếp',
    icon: '⚡',
    color: '#1D9E75',
    earnedAt: '05/06/2026'
  },
  {
    id: 'ach_4',
    title: 'Vua kiến tạo',
    description: 'Đạt tổng cộng 15 đường kiến tạo thành bàn',
    icon: '🎯',
    color: '#378ADD',
    earnedAt: '22/05/2026'
  },
  {
    id: 'ach_5',
    title: 'Chiến binh bền bỉ',
    description: 'Thi đấu trên 40 trận chính thức trên hệ thống',
    icon: '🛡️',
    color: '#8B5CF6',
    earnedAt: '14/08/2026'
  }
];
