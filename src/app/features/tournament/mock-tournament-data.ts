export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';
export type TournamentFormat = 'vong_bang' | 'loai_truc_tiep' | 'ket_hop';
export type RankCategory = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'ALL';

export interface TournamentTeam {
  id: string;
  name: string;
  logo: string;
  rank: RankCategory;
  elo: number;
  registeredAt: string;
  group?: string; // e.g. "A", "B" (used in 'ket_hop' format)
}

export interface TournamentMatch {
  id: string;
  stage: 'group' | 'knockout';
  group?: string; // e.g. "A", "B"
  round: string; // e.g. "Vòng Bảng 1", "Bán Kết", "Chung Kết"
  time: string;
  pitch: string;
  teamA: {
    name: string;
    logo: string;
    score?: number;
  };
  teamB: {
    name: string;
    logo: string;
    score?: number;
  };
  status: 'scheduled' | 'live' | 'finished';
}

export interface Tournament {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  status: TournamentStatus;
  format: TournamentFormat;
  minRank: RankCategory;
  fee: number;
  prize: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  registeredTeams: number;
  maxTeams: number;
  location: string;
  teams?: TournamentTeam[];
  matches?: TournamentMatch[];
}

// Shareable mock teams list
const COMMON_TEAMS: TournamentTeam[] = [
  { id: 'TEAM01', name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG', rank: 'B', elo: 1250, registeredAt: '2026-08-10T14:30:00Z' },
  { id: 'TEAM02', name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa', rank: 'C', elo: 1120, registeredAt: '2026-08-11T09:15:00Z' },
  { id: 'TEAM03', name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi', rank: 'A', elo: 1350, registeredAt: '2026-08-12T16:45:00Z' },
  { id: 'TEAM04', name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC', rank: 'B', elo: 1210, registeredAt: '2026-08-12T10:00:00Z' },
  { id: 'TEAM05', name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG', rank: 'C', elo: 1180, registeredAt: '2026-08-13T11:20:00Z' },
  { id: 'TEAM06', name: 'Dortmund Việt Nam', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DortmundVN', rank: 'D', elo: 1050, registeredAt: '2026-08-14T08:00:00Z' },
  { id: 'TEAM07', name: 'Hoàng Anh Gia Lai Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=HAGL', rank: 'B', elo: 1230, registeredAt: '2026-08-14T15:30:00Z' },
  { id: 'TEAM08', name: 'Bình Dương FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BinhDuong', rank: 'C', elo: 1140, registeredAt: '2026-08-15T13:45:00Z' },
  { id: 'TEAM09', name: 'Red Bull Sài Gòn', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RedBull', rank: 'B', elo: 1225, registeredAt: '2026-08-15T17:10:00Z' },
  { id: 'TEAM10', name: '307 Phủi FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=307Phui', rank: 'D', elo: 1020, registeredAt: '2026-08-16T11:50:00Z' },
  { id: 'TEAM11', name: 'Lão Tướng Quận 3', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=LaoTuong', rank: 'C', elo: 1100, registeredAt: '2026-08-16T14:20:00Z' },
  { id: 'TEAM12', name: 'Trẻ Phú Nhuận FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TrePN', rank: 'E', elo: 950, registeredAt: '2026-08-17T09:40:00Z' }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'T001',
    name: 'Giải bóng đá PitchVN Super Cup 2025',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    description: 'Giải đấu thường niên dành cho các đội bóng phong trào hàng đầu với tổng giải thưởng lên đến 50 triệu đồng.',
    status: 'upcoming',
    format: 'ket_hop',
    minRank: 'C',
    fee: 2000000,
    prize: '50.000.000đ',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-09-30T00:00:00Z',
    organizer: {
      id: 'ORG01',
      name: 'PitchVN Official',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    registeredTeams: 12,
    maxTeams: 16,
    location: 'Sân bóng Chảo Lửa, Tân Bình, TP.HCM',
    teams: COMMON_TEAMS.slice(0, 12).map((team, index) => ({
      ...team,
      group: index < 6 ? 'A' : 'B'
    })),
    matches: [
      // Bảng A
      {
        id: 'T001-M01',
        stage: 'group',
        group: 'A',
        round: 'Vòng Bảng 1',
        time: '18:00 - 01/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG' },
        teamB: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa' },
        status: 'scheduled'
      },
      {
        id: 'T001-M02',
        stage: 'group',
        group: 'A',
        round: 'Vòng Bảng 1',
        time: '19:30 - 01/09/2026',
        pitch: 'Sân số 2 - Chảo Lửa',
        teamA: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi' },
        teamB: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC' },
        status: 'scheduled'
      },
      {
        id: 'T001-M03',
        stage: 'group',
        group: 'A',
        round: 'Vòng Bảng 1',
        time: '21:00 - 01/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG' },
        teamB: { name: 'Dortmund Việt Nam', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DortmundVN' },
        status: 'scheduled'
      },
      // Bảng B
      {
        id: 'T001-M04',
        stage: 'group',
        group: 'B',
        round: 'Vòng Bảng 1',
        time: '18:00 - 02/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'Hoàng Anh Gia Lai Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=HAGL' },
        teamB: { name: 'Bình Dương FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BinhDuong' },
        status: 'scheduled'
      },
      {
        id: 'T001-M05',
        stage: 'group',
        group: 'B',
        round: 'Vòng Bảng 1',
        time: '19:30 - 02/09/2026',
        pitch: 'Sân số 2 - Chảo Lửa',
        teamA: { name: 'Red Bull Sài Gòn', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RedBull' },
        teamB: { name: '307 Phủi FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=307Phui' },
        status: 'scheduled'
      },
      {
        id: 'T001-M06',
        stage: 'group',
        group: 'B',
        round: 'Vòng Bảng 1',
        time: '21:00 - 02/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'Lão Tướng Quận 3', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=LaoTuong' },
        teamB: { name: 'Trẻ Phú Nhuận FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TrePN' },
        status: 'scheduled'
      },
      // Knockout stage
      {
        id: 'T001-M07',
        stage: 'knockout',
        round: 'Bán Kết 1',
        time: '18:00 - 15/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'Nhất Bảng A', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD1' },
        teamB: { name: 'Nhì Bảng B', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD2' },
        status: 'scheduled'
      },
      {
        id: 'T001-M08',
        stage: 'knockout',
        round: 'Bán Kết 2',
        time: '19:30 - 15/09/2026',
        pitch: 'Sân số 2 - Chảo Lửa',
        teamA: { name: 'Nhất Bảng B', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD3' },
        teamB: { name: 'Nhì Bảng A', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD4' },
        status: 'scheduled'
      },
      {
        id: 'T001-M09',
        stage: 'knockout',
        round: 'Chung Kết',
        time: '19:00 - 20/09/2026',
        pitch: 'Sân số 1 - Chảo Lửa',
        teamA: { name: 'Thắng Bán Kết 1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD5' },
        teamB: { name: 'Thắng Bán Kết 2', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD6' },
        status: 'scheduled'
      }
    ]
  },
  {
    id: 'T002',
    name: 'Giải Giao hữu Cuối tuần Quận 7',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    description: 'Giải đấu nhỏ giao lưu cuối tuần giữa các đội bóng văn phòng.',
    status: 'ongoing',
    format: 'vong_bang',
    minRank: 'D',
    fee: 500000,
    prize: '10.000.000đ',
    startDate: '2026-08-15T00:00:00Z',
    endDate: '2026-08-25T00:00:00Z',
    organizer: {
      id: 'ORG02',
      name: 'Sân bóng Nam Sài Gòn',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    registeredTeams: 8,
    maxTeams: 8,
    location: 'Sân bóng Nam Sài Gòn, Quận 7, TP.HCM',
    teams: COMMON_TEAMS.slice(0, 8),
    matches: [
      {
        id: 'T002-M01',
        stage: 'group',
        round: 'Vòng 1',
        time: '18:00 - 15/08/2026',
        pitch: 'Sân A - Nam Sài Gòn',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG', score: 3 },
        teamB: { name: 'Dortmund Việt Nam', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DortmundVN', score: 0 },
        status: 'finished'
      },
      {
        id: 'T002-M02',
        stage: 'group',
        round: 'Vòng 1',
        time: '19:30 - 15/08/2026',
        pitch: 'Sân B - Nam Sài Gòn',
        teamA: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa', score: 2 },
        teamB: { name: 'Hoàng Anh Gia Lai Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=HAGL', score: 2 },
        status: 'finished'
      },
      {
        id: 'T002-M03',
        stage: 'group',
        round: 'Vòng 1',
        time: '21:00 - 15/08/2026',
        pitch: 'Sân A - Nam Sài Gòn',
        teamA: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi', score: 4 },
        teamB: { name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG', score: 1 },
        status: 'finished'
      },
      {
        id: 'T002-M04',
        stage: 'group',
        round: 'Vòng 1',
        time: '18:00 - 16/08/2026',
        pitch: 'Sân B - Nam Sài Gòn',
        teamA: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC', score: 1 },
        teamB: { name: 'Bình Dương FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BinhDuong', score: 2 },
        status: 'finished'
      },
      // Vòng 2
      {
        id: 'T002-M05',
        stage: 'group',
        round: 'Vòng 2',
        time: '18:00 - 22/08/2026',
        pitch: 'Sân A - Nam Sài Gòn',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG', score: 1 },
        teamB: { name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG', score: 1 },
        status: 'live'
      },
      {
        id: 'T002-M06',
        stage: 'group',
        round: 'Vòng 2',
        time: '19:30 - 22/08/2026',
        pitch: 'Sân B - Nam Sài Gòn',
        teamA: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC' },
        teamB: { name: 'Bình Dương FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BinhDuong' },
        status: 'scheduled'
      },
      {
        id: 'T002-M07',
        stage: 'group',
        round: 'Vòng 2',
        time: '21:00 - 22/08/2026',
        pitch: 'Sân A - Nam Sài Gòn',
        teamA: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa' },
        teamB: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi' },
        status: 'scheduled'
      },
      {
        id: 'T002-M08',
        stage: 'group',
        round: 'Vòng 2',
        time: '18:00 - 23/08/2026',
        pitch: 'Sân B - Nam Sài Gòn',
        teamA: { name: 'Hoàng Anh Gia Lai Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=HAGL' },
        teamB: { name: 'Dortmund Việt Nam', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DortmundVN' },
        status: 'scheduled'
      }
    ]
  },
  {
    id: 'T003',
    name: 'Cúp Độc Lập 2/9 - Hà Nội Mở rộng',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf6LAP13dc7Hi0Z5KDDPfeiCyLL9EA8ZFoRzW5ACtx1g&s=10',
    description: 'Giải đấu lớn chào mừng Quốc khánh dành cho các đội bóng khu vực miền Bắc.',
    status: 'upcoming',
    format: 'loai_truc_tiep',
    minRank: 'B',
    fee: 3000000,
    prize: '100.000.000đ',
    startDate: '2026-09-02T00:00:00Z',
    endDate: '2026-09-10T00:00:00Z',
    organizer: {
      id: 'ORG03',
      name: 'Liên đoàn Bóng đá Phong trào HN',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    registeredTeams: 8,
    maxTeams: 8,
    location: 'Sân bóng Bộ Công An, Cầu Giấy, Hà Nội',
    teams: COMMON_TEAMS.slice(0, 8),
    matches: [
      {
        id: 'T003-M01',
        stage: 'knockout',
        round: 'Tứ Kết 1',
        time: '18:00 - 02/09/2026',
        pitch: 'Sân A - Bộ Công An',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG' },
        teamB: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa' },
        status: 'scheduled'
      },
      {
        id: 'T003-M02',
        stage: 'knockout',
        round: 'Tứ Kết 2',
        time: '19:30 - 02/09/2026',
        pitch: 'Sân B - Bộ Công An',
        teamA: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi' },
        teamB: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC' },
        status: 'scheduled'
      },
      {
        id: 'T003-M03',
        stage: 'knockout',
        round: 'Tứ Kết 3',
        time: '18:00 - 03/09/2026',
        pitch: 'Sân A - Bộ Công An',
        teamA: { name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG' },
        teamB: { name: 'Dortmund Việt Nam', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DortmundVN' },
        status: 'scheduled'
      },
      {
        id: 'T003-M04',
        stage: 'knockout',
        round: 'Tứ Kết 4',
        time: '19:30 - 03/09/2026',
        pitch: 'Sân B - Bộ Công An',
        teamA: { name: 'Hoàng Anh Gia Lai Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=HAGL' },
        teamB: { name: 'Bình Dương FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BinhDuong' },
        status: 'scheduled'
      },
      // Bán kết
      {
        id: 'T003-M05',
        stage: 'knockout',
        round: 'Bán Kết 1',
        time: '18:00 - 06/09/2026',
        pitch: 'Sân A - Bộ Công An',
        teamA: { name: 'Thắng Tứ Kết 1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD1' },
        teamB: { name: 'Thắng Tứ Kết 2', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD2' },
        status: 'scheduled'
      },
      {
        id: 'T003-M06',
        stage: 'knockout',
        round: 'Bán Kết 2',
        time: '19:30 - 06/09/2026',
        pitch: 'Sân B - Bộ Công An',
        teamA: { name: 'Thắng Tứ Kết 3', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD3' },
        teamB: { name: 'Thắng Tứ Kết 4', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD4' },
        status: 'scheduled'
      },
      // Chung kết
      {
        id: 'T003-M07',
        stage: 'knockout',
        round: 'Chung Kết',
        time: '19:00 - 10/09/2026',
        pitch: 'Sân A - Bộ Công An',
        teamA: { name: 'Thắng Bán Kết 1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD5' },
        teamB: { name: 'Thắng Bán Kết 2', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD6' },
        status: 'scheduled'
      }
    ]
  },
  {
    id: 'T004',
    name: 'Giải Đấu Dưỡng Sinh Mùa Hè',
    thumbnail: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=800&auto=format&fit=crop',
    description: 'Giải đấu vui vẻ không quan trọng thắng thua, chỉ cần đam mê.',
    status: 'completed',
    format: 'vong_bang',
    minRank: 'F',
    fee: 300000,
    prize: 'Cờ lưu niệm & Cúp Nhựa',
    startDate: '2026-07-01T00:00:00Z',
    endDate: '2026-07-15T00:00:00Z',
    organizer: {
      id: 'ORG04',
      name: 'Cộng đồng Bóng đá Dưỡng Sinh',
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    registeredTeams: 8,
    maxTeams: 8,
    location: 'Sân bóng Mini, Gò Vấp, TP.HCM',
    teams: COMMON_TEAMS.slice(0, 8),
    matches: [
      {
        id: 'T004-M01',
        stage: 'group',
        round: 'Vòng 1',
        time: '18:00 - 01/07/2026',
        pitch: 'Sân số 1 - Gò Vấp',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG', score: 4 },
        teamB: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa', score: 2 },
        status: 'finished'
      },
      {
        id: 'T004-M02',
        stage: 'group',
        round: 'Vòng 1',
        time: '19:30 - 01/07/2026',
        pitch: 'Sân số 2 - Gò Vấp',
        teamA: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi', score: 1 },
        teamB: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC', score: 3 },
        status: 'finished'
      },
      {
        id: 'T004-M03',
        stage: 'group',
        round: 'Vòng 2',
        time: '18:00 - 08/07/2026',
        pitch: 'Sân số 1 - Gò Vấp',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG', score: 3 },
        teamB: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC', score: 1 },
        status: 'finished'
      },
      {
        id: 'T004-M04',
        stage: 'group',
        round: 'Vòng 2',
        time: '19:30 - 08/07/2026',
        pitch: 'Sân số 2 - Gò Vấp',
        teamA: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa', score: 0 },
        teamB: { name: 'Hà Nội Phủi Club', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Hanoi', score: 2 },
        status: 'finished'
      }
    ]
  },
  {
    id: 'T005',
    name: 'Giải Sinh Viên TP.HCM Mở Rộng',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    description: 'Sân chơi dành riêng cho sinh viên các trường đại học tại TP.HCM.',
    status: 'upcoming',
    format: 'ket_hop',
    minRank: 'E',
    fee: 1000000,
    prize: '30.000.000đ',
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-01T00:00:00Z',
    organizer: {
      id: 'ORG05',
      name: 'Hội Sinh Viên TP.HCM',
      avatar: 'https://i.pravatar.cc/150?img=15'
    },
    registeredTeams: 6,
    maxTeams: 16,
    location: 'Sân vận động Thống Nhất, TP.HCM',
    teams: COMMON_TEAMS.slice(0, 6).map((team, index) => ({
      ...team,
      group: index < 3 ? 'A' : 'B'
    })),
    matches: [
      {
        id: 'T005-M01',
        stage: 'group',
        group: 'A',
        round: 'Vòng Bảng 1',
        time: '18:00 - 01/10/2026',
        pitch: 'Sân Thống Nhất',
        teamA: { name: 'Phủi Sài Gòn FC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PhuiSG' },
        teamB: { name: 'Đông Á Thanh Hóa Phủi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ThanhHoa' },
        status: 'scheduled'
      },
      {
        id: 'T005-M02',
        stage: 'group',
        group: 'B',
        round: 'Vòng Bảng 1',
        time: '19:30 - 01/10/2026',
        pitch: 'Sân Thống Nhất',
        teamA: { name: 'Manchester FC HCMC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ManHCMC' },
        teamB: { name: 'FC Barcelona Saigon', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BarcaSG' },
        status: 'scheduled'
      }
    ]
  }
];
