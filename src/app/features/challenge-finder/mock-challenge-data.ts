// ════════════════════════════════════════════════════════════
//   PITCHVN — CHALLENGE MATCHMAKING MOCK DATA & INTERFACES
// ════════════════════════════════════════════════════════════

export type RankTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface RankInfo {
  tier: RankTier;
  title: string;
  minElo: number;
  color: string;
  bgLight: string;
}

export const RANK_TIERS: Record<RankTier, RankInfo> = {
  S: { tier: 'S', title: 'Siêu đỉnh', minElo: 2000, color: '#EF9F27', bgLight: 'rgba(239, 159, 39, 0.12)' },
  A: { tier: 'A', title: 'Chuyên nghiệp', minElo: 1700, color: '#1D9E75', bgLight: 'rgba(29, 158, 117, 0.12)' },
  B: { tier: 'B', title: 'Khá', minElo: 1450, color: '#378ADD', bgLight: 'rgba(55, 138, 221, 0.12)' },
  C: { tier: 'C', title: 'Trung bình', minElo: 1200, color: '#639922', bgLight: 'rgba(99, 153, 34, 0.12)' },
  D: { tier: 'D', title: 'Phong trào', minElo: 1000, color: '#D85A30', bgLight: 'rgba(216, 90, 48, 0.12)' },
  E: { tier: 'E', title: 'Nghiệp dư', minElo: 800, color: '#D4537E', bgLight: 'rgba(212, 83, 126, 0.12)' },
  F: { tier: 'F', title: 'Dưỡng sinh', minElo: 0, color: '#888780', bgLight: 'rgba(136, 135, 128, 0.12)' },
};

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'captain' | 'vice_captain' | 'member';
  roleTitle: string;
  jerseyNumber: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  elo: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  captainName: string;
  captainPhone: string;
  district: string;
  city: string;
  homePitch: string;
  mainKitColor: string;
  subKitColor: string;
  rank: RankTier;
  eloScore: number;
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number; // %
  goalsFor: number;
  goalsAgainst: number;
  recentForm: ('W' | 'D' | 'L')[];
  fairPlayRating: number; // 1-5
  membersCount: number;
  description: string;
  members: TeamMember[];
}

export type ChallengeType = 'team' | 'individual';
export type IndividualSubtype = 'team_needs_player' | 'player_needs_team';

export interface Challenge {
  id: string;
  type: ChallengeType; // Kèo đội vs đội hoặc Kèo ghép người
  individualSubtype?: IndividualSubtype; // 'team_needs_player' (Đội tìm người) | 'player_needs_team' (Người tìm đội)
  creatorTeam?: Team;
  creatorUser?: {
    id: string;
    name: string;
    avatar: string;
    rank: RankTier;
    elo: number;
    phone: string;
    preferredPosition?: string | string[];
    preferredDistricts?: string[];  // Khu vực muốn đá
    areaNote?: string;              // Mô tả thêm khu vực
  };
  neededSlots?: number; // Số lượng người đội đang cần tìm
  neededPositions?: string[]; // Vị trí cần tuyển (GK, DF, MF, FW)
  title: string;
  format: '5v5' | '7v7' | '11v11';
  formatLabel: string;
  matchDate: Date; // "Hôm nay, 19:30" or YYYY-MM-DD
  matchTime: string; // "19:00 - 20:30"
  pitchId?: string;
  // Full pitch data included by the challenges API when a venue is selected.
  pitch?: any;
  pitchName: string;
  pitchAddress: string;
  district: string;
  feeSplit: '50-50' | 'loser-pays' | '60-40';
  feeSplitLabel: string;
  estimatedPrice: number;
  targetRanks: RankTier[]; // Hạng mong muốn ghép kèo
  note: string;
  status: 'open' | 'matched' | 'completed';
  createdAt: string;
  applicantsCount: number;
  hasPitchAlready: boolean; // Đã có sân sẵn hay cần tìm sân
  contactPhone: string;
  distanceKm?: number;       // Khoảng cách ước tính từ vị trí hiện tại tới sân (km)
  areaNote?: string;         // Ghi chú thêm về khu vực / địa điểm của bài đăng
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

// ════════════════════════════════════════════════════════════
//   CURRENT USER'S TEAM
// ════════════════════════════════════════════════════════════
export const MY_TEAM: Team = {
  id: 'team_my',
  name: 'FC Bão Táp Cầu Giấy',
  logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCBaoTap',
  captainName: 'Nguyễn Văn A (Bạn)',
  captainPhone: '0988 888 888',
  district: 'Cầu Giấy',
  city: 'Hà Nội',
  homePitch: 'Sân bóng Chảo Lửa Cầu Giấy',
  mainKitColor: 'Xanh Neon',
  subKitColor: 'Trắng',
  rank: 'B',
  eloScore: 1540,
  totalMatches: 28,
  wins: 16,
  draws: 6,
  losses: 6,
  winRate: 57,
  goalsFor: 72,
  goalsAgainst: 41,
  recentForm: ['W', 'W', 'D', 'W', 'L'],
  fairPlayRating: 4.9,
  membersCount: 14,
  description: 'Đội bóng văn phòng công nghệ Cầu Giấy, lối đá ban bật nhỏ đẹp mắt, giao lưu nhiệt tình, không cay cú ăn thua.',
  members: [
    { id: 'm1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=a1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 10, position: 'MF', elo: 1580 },
    { id: 'm2', name: 'Trần Văn Hải', avatar: 'https://i.pravatar.cc/150?u=a2', role: 'vice_captain', roleTitle: 'Đội phó', jerseyNumber: 7, position: 'FW', elo: 1520 },
    { id: 'm3', name: 'Lê Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=a3', role: 'member', roleTitle: 'Thủ môn', jerseyNumber: 1, position: 'GK', elo: 1510 },
    { id: 'm4', name: 'Phạm Đức Dũng', avatar: 'https://i.pravatar.cc/150?u=a4', role: 'member', roleTitle: 'Hậu vệ', jerseyNumber: 4, position: 'DF', elo: 1490 },
  ],
};

// ════════════════════════════════════════════════════════════
//   MOCK TEAMS
// ════════════════════════════════════════════════════════════
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team_1',
    name: 'FC Sông Trà',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCSongTra',
    captainName: 'Phạm Hồng Thái',
    captainPhone: '0977 123 456',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    homePitch: 'Sân bóng Chảo Lửa Cầu Giấy',
    mainKitColor: 'Đỏ Đen',
    subKitColor: 'Vàng',
    rank: 'A',
    eloScore: 1785,
    totalMatches: 45,
    wins: 30,
    draws: 8,
    losses: 7,
    winRate: 67,
    goalsFor: 120,
    goalsAgainst: 55,
    recentForm: ['W', 'W', 'W', 'D', 'W'],
    fairPlayRating: 5.0,
    membersCount: 18,
    description: 'Đội bóng phong trào kỳ cựu khu vực Cầu Giấy. Chuyên giao lưu sân 7 các tối trong tuần, tôn trọng đối thủ.',
    members: [
      { id: 'st1', name: 'Phạm Hồng Thái', avatar: 'https://i.pravatar.cc/150?u=st1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 9, position: 'FW', elo: 1820 },
      { id: 'st2', name: 'Nguyễn Thành Long', avatar: 'https://i.pravatar.cc/150?u=st2', role: 'vice_captain', roleTitle: 'Đội phó', jerseyNumber: 8, position: 'MF', elo: 1750 },
    ],
  },
  {
    id: 'team_2',
    name: 'FC Thanh Xuân Titans',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCTitans',
    captainName: 'Lê Hoàng Nam',
    captainPhone: '0912 999 888',
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    homePitch: 'Sân vận động KTX Mễ Trì',
    mainKitColor: 'Xanh Dương',
    subKitColor: 'Trắng',
    rank: 'B',
    eloScore: 1480,
    totalMatches: 22,
    wins: 11,
    draws: 5,
    losses: 6,
    winRate: 50,
    goalsFor: 48,
    goalsAgainst: 36,
    recentForm: ['W', 'L', 'W', 'D', 'W'],
    fairPlayRating: 4.8,
    membersCount: 15,
    description: 'Đội bóng cựu sinh viên Bách Khoa - Xây Dựng. Đá cống hiến, tinh thần đồng đội cao.',
    members: [
      { id: 'tt1', name: 'Lê Hoàng Nam', avatar: 'https://i.pravatar.cc/150?u=tt1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 11, position: 'MF', elo: 1510 },
    ],
  },
  {
    id: 'team_3',
    name: 'FC Mễ Trì United',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCMeTri',
    captainName: 'Vũ Quốc Huy',
    captainPhone: '0904 333 222',
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    homePitch: 'Sân bóng Mỹ Đình Sport',
    mainKitColor: 'Cam',
    subKitColor: 'Đen',
    rank: 'C',
    eloScore: 1260,
    totalMatches: 16,
    wins: 7,
    draws: 3,
    losses: 6,
    winRate: 44,
    goalsFor: 32,
    goalsAgainst: 29,
    recentForm: ['D', 'W', 'L', 'W', 'L'],
    fairPlayRating: 4.7,
    membersCount: 12,
    description: 'Anh em khu vực Mễ Trì - Nam Từ Liêm, tìm kèo giao lưu vui vẻ nâng cao thể lực.',
    members: [
      { id: 'mt1', name: 'Vũ Quốc Huy', avatar: 'https://i.pravatar.cc/150?u=mt1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 6, position: 'DF', elo: 1280 },
    ],
  },
  {
    id: 'team_4',
    name: 'FC Dưỡng Sinh Weekend',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCDuongSinh',
    captainName: 'Đặng Tuấn Anh',
    captainPhone: '0936 777 666',
    district: 'Đống Đa',
    city: 'Hà Nội',
    homePitch: 'Sân Thủy Lợi Tây Sơn',
    mainKitColor: 'Xanh Lá',
    subKitColor: 'Xám',
    rank: 'D',
    eloScore: 1050,
    totalMatches: 14,
    wins: 5,
    draws: 4,
    losses: 5,
    winRate: 36,
    goalsFor: 25,
    goalsAgainst: 28,
    recentForm: ['D', 'D', 'L', 'W', 'D'],
    fairPlayRating: 5.0,
    membersCount: 16,
    description: 'Đội gồm toàn anh em 8x, 9x đời đầu, chỉ đá vui cuối tuần đổ mồ hôi, nghiêm cấm xoạc bóng thô bạo.',
    members: [
      { id: 'ds1', name: 'Đặng Tuấn Anh', avatar: 'https://i.pravatar.cc/150?u=ds1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 88, position: 'MF', elo: 1060 },
    ],
  },
  {
    id: 'team_5',
    name: 'FC Royal Knights Hà Nội',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCRoyal',
    captainName: 'Hoàng Minh Quân',
    captainPhone: '0982 555 444',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    homePitch: 'Sân bóng Thượng Đình EcoPitch',
    mainKitColor: 'Tím Vàng',
    subKitColor: 'Đen',
    rank: 'S',
    eloScore: 2045,
    totalMatches: 60,
    wins: 46,
    draws: 8,
    losses: 6,
    winRate: 77,
    goalsFor: 185,
    goalsAgainst: 68,
    recentForm: ['W', 'W', 'W', 'W', 'W'],
    fairPlayRating: 4.9,
    membersCount: 20,
    description: 'Đội bóng vô địch giải HPL Phong Trào Cúp Mùa Xuân 2025. Tìm kèo cọ xát với các đội hạng S hoặc A cứng.',
    members: [
      { id: 'rk1', name: 'Hoàng Minh Quân', avatar: 'https://i.pravatar.cc/150?u=rk1', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 10, position: 'FW', elo: 2100 },
    ],
  },
];

// ════════════════════════════════════════════════════════════
//   MOCK CHALLENGES
// ════════════════════════════════════════════════════════════
export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'chl_1',
    type: 'team',
    creatorTeam: MOCK_TEAMS[0], // FC Sông Trà (Hạng A)
    title: 'Tìm đối cứng giao lưu sân 7 tối mai tại Cầu Giấy',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '19:00 - 20:30',
    pitchName: 'Sân bóng Chảo Lửa Cầu Giấy',
    pitchAddress: 'Số 10 Chu Văn An, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    feeSplit: '50-50',
    feeSplitLabel: 'Cưa đôi 5-5 (Tiền sân + Nước)',
    estimatedPrice: 550000,
    targetRanks: ['S', 'A', 'B'],
    note: 'Đội mình đã đặt sân sẵn lúc 19h00. Cần tìm đối thủ ngang cơ hạng A hoặc B cứng, đá cống hiến tôn trọng luật.',
    status: 'open',
    createdAt: '15 phút trước',
    applicantsCount: 3,
    hasPitchAlready: true,
    contactPhone: '0977 123 456',
    distanceKm: 1.2,
    areaNote: 'Gần ngã tư Cầu Giấy, đỗ xe dễ dàng',
  },
  {
    id: 'chl_2',
    type: 'team',
    creatorTeam: MOCK_TEAMS[1], // FC Thanh Xuân Titans (Hạng B)
    title: 'Giao lưu sân 7 cuối tuần khu vực Thanh Xuân / Hà Đông',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '17:30 - 19:00',
    pitchName: 'Sân vận động KTX Mễ Trì',
    pitchAddress: '182 Lương Thế Vinh, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    feeSplit: '50-50',
    feeSplitLabel: 'Cưa đôi 5-5',
    estimatedPrice: 480000,
    targetRanks: ['B', 'C'],
    note: 'Đội văn phòng đá vui vẻ thể lực, tìm kèo hạng B hoặc C. Chưa chốt sân có thể thương lượng đổi sân tiện 2 bên.',
    status: 'open',
    createdAt: '1 giờ trước',
    applicantsCount: 1,
    hasPitchAlready: true,
    contactPhone: '0912 999 888',
    distanceKm: 3.8,
    areaNote: 'Khu vực Thanh Xuân / Hà Đông, cạnh siêu thị Aeon',
  },
  {
    id: 'chl_team_needs_1',
    type: 'individual',
    individualSubtype: 'team_needs_player',
    creatorTeam: MOCK_TEAMS[0], // FC Sông Trà
    neededSlots: 2,
    neededPositions: ['MF', 'DF'],
    title: 'FC Sông Trà tìm gấp 2 chân ghép đá tối nay (Tiền vệ/Hậu vệ)',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '20:00 - 21:30',
    pitchName: 'Sân bóng Chảo Lửa Cầu Giấy',
    pitchAddress: 'Số 10 Chu Văn An, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    feeSplit: '50-50',
    feeSplitLabel: 'Đóng 50k / người (Bao gồm nước)',
    estimatedPrice: 50000,
    targetRanks: ['A', 'B', 'C'],
    note: 'Đội mình thiếu 2 bạn đá vị trí tiền vệ trung tâm và trung vệ. Đội đá vui vẻ, anh em hòa đồng, đá xong có trà đá giao lưu.',
    status: 'open',
    createdAt: '10 phút trước',
    applicantsCount: 1,
    hasPitchAlready: true,
    contactPhone: '0977 123 456',
    distanceKm: 0.9,
    areaNote: 'Cầu Giấy – Dịch Vọng Hậu, đi bộ từ phố Cầu Giấy được',
  },
  {
    id: 'chl_player_needs_1',
    type: 'individual',
    individualSubtype: 'player_needs_team',
    creatorUser: {
      id: 'u_tuyen',
      name: 'Nguyễn Tiến Dũng (Tiền đạo)',
      avatar: 'https://i.pravatar.cc/150?u=u_tuyen',
      rank: 'B',
      elo: 1490,
      phone: '0945 111 222',
      preferredPosition: 'Tiền đạo cánh (FW) / Hộ công (CAM)',
      preferredDistricts: ['Cầu Giấy', 'Nam Từ Liêm'],
      areaNote: 'Ưu tiên khu Cầu Giấy, Nam Từ Liêm. Có xe máy đi sân thoải mái.',
    },
    title: 'Cầu thủ tự do tìm đội ghép đá tối nay tại Cầu Giấy / Nam Từ Liêm',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '18:30 - 20:30',
    pitchName: 'Sân Chảo Lửa hoặc Mỹ Đình',
    pitchAddress: 'Cầu Giấy / Nam Từ Liêm',
    district: 'Cầu Giấy',
    feeSplit: '50-50',
    feeSplitLabel: 'Chia tiền sân theo đầu người',
    estimatedPrice: 60000,
    targetRanks: ['A', 'B', 'C'],
    note: 'Mình đá vị trí tiền đạo / tiền vệ cánh, thể lực tốt, có xe đi lại, tinh thần thi đấu nhiệt tình. Đội nào thiếu người tối nay ới mình nhé!',
    status: 'open',
    createdAt: '25 phút trước',
    applicantsCount: 4,
    hasPitchAlready: false,
    contactPhone: '0945 111 222',
    distanceKm: 2.1,
    areaNote: 'Cầu Giấy hoặc Nam Từ Liêm đều oke',
  },
  {
    id: 'chl_team_needs_2',
    type: 'individual',
    individualSubtype: 'team_needs_player',
    creatorTeam: MOCK_TEAMS[2], // FC Mễ Trì United
    neededSlots: 1,
    neededPositions: ['GK'],
    title: 'FC Mễ Trì United tuyển gấp 1 Thủ Môn (GK) bắt chính tối Thứ 5',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '19:30 - 21:00',
    pitchName: 'Sân bóng Mỹ Đình Sport',
    pitchAddress: 'Lê Đức Thọ, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    feeSplit: '50-50',
    feeSplitLabel: 'Miễn phí tiền sân cho Thủ môn',
    estimatedPrice: 0,
    targetRanks: ['B', 'C', 'D'],
    note: 'Thủ môn đội mình bận công tác nên cần tìm 1 bạn bắt thay, đội bao trọn tiền sân và nước uống cho thủ môn.',
    status: 'open',
    createdAt: '40 phút trước',
    applicantsCount: 2,
    hasPitchAlready: true,
    contactPhone: '0904 333 222',
    distanceKm: 5.3,
    areaNote: 'Nam Từ Liêm – gần Mỹ Đình, có bãi đỗ xe rộng',
  },
  {
    id: 'chl_3',
    type: 'team',
    creatorTeam: MOCK_TEAMS[4], // FC Royal Knights (Hạng S)
    title: 'Thách đấu giao hữu đỉnh cao trước thềm giải đấu mở rộng',
    format: '7v7',
    formatLabel: 'Sân 7',
    matchDate: new Date(2026, 7, 14),
    matchTime: '20:00 - 21:30',
    pitchName: 'Sân bóng Thượng Đình EcoPitch',
    pitchAddress: '129 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    feeSplit: 'loser-pays',
    feeSplitLabel: 'Bên thua trả tiền sân',
    estimatedPrice: 650000,
    targetRanks: ['S', 'A'],
    note: 'Kèo phân tài cao thấp có tính ELO chính thức. Tìm các đội hạng S hoặc A+ sẵn sàng so tài cọ xát đỉnh cao.',
    status: 'open',
    createdAt: '3 giờ trước',
    applicantsCount: 5,
    hasPitchAlready: true,
    contactPhone: '0982 555 444',
    distanceKm: 4.6,
    areaNote: 'Thanh Xuân – Nguyễn Trãi, sân mặt cỏ nhân tạo cao cấp',
  },
  {
    id: 'chl_4',
    type: 'team',
    creatorTeam: MOCK_TEAMS[3], // FC Dưỡng Sinh Weekend (Hạng D)
    title: 'Tìm kèo dưỡng sinh sân 5 hoặc 7, không va chạm',
    format: '5v5',
    formatLabel: 'Sân 5',
    matchDate: new Date(2026, 7, 14),
    matchTime: '07:30 - 09:00',
    pitchName: 'Sân Thủy Lợi Tây Sơn',
    pitchAddress: 'Số 175 Tây Sơn, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    feeSplit: '50-50',
    feeSplitLabel: 'Cưa đôi 5-5',
    estimatedPrice: 320000,
    targetRanks: ['C', 'D', 'E', 'F'],
    note: 'Đội toàn anh em trung niên đá rèn luyện sức khỏe, ưu tiên đội bạn đá nhẹ nhàng, giao lưu trà đá sau trận.',
    status: 'open',
    createdAt: '5 giờ trước',
    applicantsCount: 2,
    hasPitchAlready: false,
    contactPhone: '0936 777 666',
    distanceKm: 7.2,
    areaNote: 'Đống Đa – Tây Sơn, gần công viên Thống Nhất',
  },
];

// ════════════════════════════════════════════════════════════
//   INITIAL CHAT MESSAGES
// ════════════════════════════════════════════════════════════
export const MOCK_CHATS: Record<string, ChatMessage[]> = {
  chl_1: [
    {
      id: 'c1',
      senderId: 'team_1',
      senderName: 'FC Sông Trà (Đội trưởng Thái)',
      senderAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCSongTra',
      text: 'Chào bạn! Đội mình đã chốt sân Chảo Lửa 7A lúc 19h00 tối mai rồi nhé.',
      timestamp: '19:40',
      isMine: false,
    },
    {
      id: 'c2',
      senderId: 'my_id',
      senderName: 'FC Bão Táp',
      senderAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=FCBaoTap',
      text: 'Chào anh Thái! FC Bão Táp bên em tối mai đủ người, bên em nhận kèo giao lưu 5-5 nhé!',
      timestamp: '19:42',
      isMine: true,
    },
  ],
};
