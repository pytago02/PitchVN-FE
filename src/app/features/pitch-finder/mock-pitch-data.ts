// ════════════════════════════════════════════════════════════
//   PITCHVN — PITCH FINDER MOCK DATA & INTERFACES
// ════════════════════════════════════════════════════════════

export interface PitchFacility {
  id: string;
  name: string;
  icon: string;
}

export interface SubPitch {
  id: string;
  name: string; // "Sân 7A", "Sân 7B", "Sân 5A", "Sân 11"
  type: '5v5' | '7v7' | '11v11';
  typeLabel: string;
  surface: 'Cỏ nhân tạo 5 sao' | 'Cỏ nhân tạo tiêu chuẩn' | 'Cỏ tự nhiên' | 'Trong nhà / Mái che';
  hasCover: boolean;
  basePrice: number; // vnđ / trận 90p
}

export interface TimeSlot {
  id: string;
  pitchId: string;
  subPitchId: string;
  subPitchName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "17:30"
  endTime: string; // "19:00"
  price: number; // vnđ
  status: 'available' | 'booked' | 'held' | 'selected';
  isGoldenHour?: boolean; // Khung giờ vàng (17:30 - 20:30)
}

export interface PitchReview {
  id: string;
  userName: string;
  userAvatar: string;
  userRank: string;
  rating: number; // 1-5
  date: string;
  comment: string;
}

export interface Pitch {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  distanceKm: number; // Khoảng cách giả lập từ vị trí người dùng
  rating: number;
  reviewCount: number;
  minPrice: number;
  maxPrice: number;
  images: string[];
  coverImage: string;
  openHours: string;
  description: string;
  facilities: string[];
  subPitches: SubPitch[];
  availableSlotsCount: number;
  isVerified: boolean;
  featured?: boolean;
}

export interface PitchBooking {
  bookingCode: string;
  pitch: Pitch;
  subPitch: SubPitch;
  date: string;
  slot: TimeSlot;
  totalPrice: number;
  userName: string;
  userPhone: string;
  userNote?: string;
  paymentMethod: 'vietqr' | 'momo' | 'vnpay' | 'cash';
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
}

// ════════════════════════════════════════════════════════════
//   FACILITIES LIST
// ════════════════════════════════════════════════════════════
export const ALL_FACILITIES: PitchFacility[] = [
  { id: 'parking_car', name: 'Bãi đỗ ô tô', icon: 'pi pi-car' },
  { id: 'lighting', name: 'Đèn LED ban đêm', icon: 'pi pi-sun' },
  { id: 'shower', name: 'Tắm nóng lạnh', icon: 'pi pi-heart' },
  { id: 'canteen', name: 'Căn tin / Nước uống', icon: 'pi pi-shopping-bag' },
  { id: 'covered', name: 'Có mái che', icon: 'pi pi-home' },
  { id: 'bib_rent', name: 'Cho thuê áo bib', icon: 'pi pi-tag' },
  { id: 'referee', name: 'Hỗ trợ trọng tài', icon: 'pi pi-flag' },
  { id: 'wifi', name: 'Wifi miễn phí', icon: 'pi pi-wifi' },
];

// ════════════════════════════════════════════════════════════
//   MOCK PITCHES (Khu vực Hà Nội)
// ════════════════════════════════════════════════════════════
export const MOCK_PITCHES: Pitch[] = [
  {
    id: 'pitch_1',
    name: 'Sân bóng Chảo Lửa Cầu Giấy',
    address: 'Số 10 Chu Văn An, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    phone: '0988 123 456',
    lat: 21.0368,
    lng: 105.7825,
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 142,
    minPrice: 350000,
    maxPrice: 650000,
    coverImage: 'https://images.unsplash.com/photo-1529900245563-202c4b8e7c10?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1529900245563-202c4b8e7c10?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '06:00 - 23:00',
    description:
      'Cụm sân cỏ nhân tạo tiêu chuẩn FIFA với mặt cỏ nhập khẩu từ Đức, dàn đèn LED chiếu sáng 400W chống chói. Bãi gửi xe ô tô rộng rãi, phòng thay đồ và tắm nước nóng miễn phí.',
    facilities: ['parking_car', 'lighting', 'shower', 'canteen', 'bib_rent', 'wifi'],
    isVerified: true,
    featured: true,
    availableSlotsCount: 6,
    subPitches: [
      { id: 'sub_1_1', name: 'Sân 7A (Khung Vàng)', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 550000 },
      { id: 'sub_1_2', name: 'Sân 7B', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 500000 },
      { id: 'sub_1_3', name: 'Sân 5A (Có mái che)', type: '5v5', typeLabel: 'Sân 5', surface: 'Trong nhà / Mái che', hasCover: true, basePrice: 350000 },
      { id: 'sub_1_4', name: 'Sân 5B (Có mái che)', type: '5v5', typeLabel: 'Sân 5', surface: 'Trong nhà / Mái che', hasCover: true, basePrice: 350000 },
    ],
  },
  {
    id: 'pitch_2',
    name: 'Sân vận động KTX Mễ Trì',
    address: '182 Lương Thế Vinh, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    phone: '0912 345 678',
    lat: 20.9984,
    lng: 105.7952,
    distanceKm: 2.8,
    rating: 4.7,
    reviewCount: 98,
    minPrice: 300000,
    maxPrice: 550000,
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '05:30 - 22:30',
    description:
      'Địa điểm quen thuộc của các giải phong trào sinh viên và văn phòng. Mặt cỏ mềm xốp, hệ thống thoát nước chuẩn không bị ngập khi mưa lớn.',
    facilities: ['lighting', 'shower', 'canteen', 'bib_rent', 'referee'],
    isVerified: true,
    featured: false,
    availableSlotsCount: 4,
    subPitches: [
      { id: 'sub_2_1', name: 'Sân 7 Số 1', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 480000 },
      { id: 'sub_2_2', name: 'Sân 7 Số 2', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 480000 },
      { id: 'sub_2_3', name: 'Sân 11 Lớn', type: '11v11', typeLabel: 'Sân 11', surface: 'Cỏ tự nhiên', hasCover: false, basePrice: 1200000 },
    ],
  },
  {
    id: 'pitch_3',
    name: 'Sân bóng Thượng Đình EcoPitch',
    address: '129 Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    phone: '0977 888 999',
    lat: 21.0028,
    lng: 105.8142,
    distanceKm: 3.5,
    rating: 4.8,
    reviewCount: 185,
    minPrice: 400000,
    maxPrice: 700000,
    coverImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '06:00 - 23:30',
    description:
      'Tổ hợp sân bóng sinh thái chất lượng cao. Mặt sân mới thay 2025, có quán cà phê ngắm sân bóng, bãi xe ô tô miễn phí sức chứa 50 xe.',
    facilities: ['parking_car', 'lighting', 'shower', 'canteen', 'covered', 'wifi'],
    isVerified: true,
    featured: true,
    availableSlotsCount: 8,
    subPitches: [
      { id: 'sub_3_1', name: 'Sân 7 VIP 1', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 600000 },
      { id: 'sub_3_2', name: 'Sân 7 VIP 2', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 600000 },
      { id: 'sub_3_3', name: 'Sân 5 Mái Vòm', type: '5v5', typeLabel: 'Sân 5', surface: 'Trong nhà / Mái che', hasCover: true, basePrice: 420000 },
    ],
  },
  {
    id: 'pitch_4',
    name: 'Sân bóng Tân Triều Arena',
    address: 'Khu Đô Thị Văn Quán, Tân Triều, Thanh Trì, Hà Nội',
    district: 'Thanh Trì',
    city: 'Hà Nội',
    phone: '0904 567 890',
    lat: 20.9782,
    lng: 105.7994,
    distanceKm: 4.8,
    rating: 4.6,
    reviewCount: 64,
    minPrice: 280000,
    maxPrice: 500000,
    coverImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1529900245563-202c4b8e7c10?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '06:00 - 22:30',
    description:
      'Khuôn viên thoáng mát, giá cả hợp lý cho anh em văn phòng và sinh viên. Hỗ trợ cho mượn bóng thi đấu Molten chính hãng và áo tập miễn phí.',
    facilities: ['lighting', 'canteen', 'bib_rent', 'parking_car'],
    isVerified: true,
    featured: false,
    availableSlotsCount: 5,
    subPitches: [
      { id: 'sub_4_1', name: 'Sân 7 Sân Cỏ 1', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 450000 },
      { id: 'sub_4_2', name: 'Sân 7 Sân Cỏ 2', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 450000 },
      { id: 'sub_4_3', name: 'Sân 5 Mini', type: '5v5', typeLabel: 'Sân 5', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 280000 },
    ],
  },
  {
    id: 'pitch_5',
    name: 'Trung tâm Bóng đá Mỹ Đình Sport',
    address: 'Đường Lê Đức Thọ, Mỹ Đình 1, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    phone: '0936 999 111',
    lat: 21.0205,
    lng: 105.7656,
    distanceKm: 5.4,
    rating: 4.9,
    reviewCount: 220,
    minPrice: 500000,
    maxPrice: 1500000,
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '06:00 - 24:00',
    description:
      'Trung tâm thể thao chuyên nghiệp với 6 sân 7 người và 2 sân 11 người đạt chuẩn thi đấu quốc gia. Hệ thống phòng VIP, livestream trận đấu tự động qua AI Camera.',
    facilities: ['parking_car', 'lighting', 'shower', 'canteen', 'referee', 'bib_rent', 'wifi'],
    isVerified: true,
    featured: true,
    availableSlotsCount: 10,
    subPitches: [
      { id: 'sub_5_1', name: 'Sân 7 Pro A1', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 650000 },
      { id: 'sub_5_2', name: 'Sân 7 Pro A2', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 650000 },
      { id: 'sub_5_3', name: 'Sân 11 Sân Vận Động', type: '11v11', typeLabel: 'Sân 11', surface: 'Cỏ tự nhiên', hasCover: false, basePrice: 1500000 },
    ],
  },
  {
    id: 'pitch_6',
    name: 'Sân bóng Thủy Lợi — Đống Đa',
    address: 'Số 175 Tây Sơn, Trung Liệt, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    city: 'Hà Nội',
    phone: '0966 234 567',
    lat: 21.0089,
    lng: 105.8236,
    distanceKm: 6.2,
    rating: 4.5,
    reviewCount: 110,
    minPrice: 320000,
    maxPrice: 520000,
    coverImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60',
    ],
    openHours: '06:00 - 22:30',
    description:
      'Nằm ở vị trí trung tâm quận Đống Đa, giao thông thuận tiện. Mặt cỏ vừa bảo dưỡng êm ái, bãi xe máy rộng có mái che.',
    facilities: ['lighting', 'canteen', 'bib_rent', 'shower'],
    isVerified: false,
    featured: false,
    availableSlotsCount: 3,
    subPitches: [
      { id: 'sub_6_1', name: 'Sân 7 Trung Tâm', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 500000 },
      { id: 'sub_6_2', name: 'Sân 5 Góc Cây', type: '5v5', typeLabel: 'Sân 5', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 320000 },
    ],
  },
];

// ════════════════════════════════════════════════════════════
//   MOCK TIME SLOTS GENERATOR
// ════════════════════════════════════════════════════════════
export function generateMockSlots(pitchId: string, subPitchId: string, subPitchName: string, dateStr: string): TimeSlot[] {
  const baseSlots = [
    { start: '06:00', end: '07:30', price: 300000, isGolden: false, status: 'available' },
    { start: '07:30', end: '09:00', price: 300000, isGolden: false, status: 'available' },
    { start: '09:00', end: '10:30', price: 250000, isGolden: false, status: 'available' },
    { start: '15:30', end: '17:00', price: 400000, isGolden: false, status: 'available' },
    { start: '17:00', end: '18:30', price: 550000, isGolden: true, status: 'booked' },
    { start: '18:30', end: '20:00', price: 650000, isGolden: true, status: 'available' },
    { start: '20:00', end: '21:30', price: 600000, isGolden: true, status: 'available' },
    { start: '21:30', end: '23:00', price: 400000, isGolden: false, status: 'available' },
  ];

  // Tùy biến trạng thái theo pitchId và subPitchId để tạo sự phong phú
  return baseSlots.map((s, idx) => {
    let status: 'available' | 'booked' | 'held' = s.status as any;
    if ((idx === 4 && pitchId === 'pitch_1') || (idx === 5 && pitchId === 'pitch_2')) {
      status = 'booked';
    } else if (idx === 6 && pitchId === 'pitch_3') {
      status = 'held';
    }

    return {
      id: `slot_${pitchId}_${subPitchId}_${dateStr}_${idx}`,
      pitchId,
      subPitchId,
      subPitchName,
      date: dateStr,
      startTime: s.start,
      endTime: s.end,
      price: s.price,
      status,
      isGoldenHour: s.isGolden,
    };
  });
}

// ════════════════════════════════════════════════════════════
//   MOCK REVIEWS
// ════════════════════════════════════════════════════════════
export const MOCK_PITCH_REVIEWS: Record<string, PitchReview[]> = {
  pitch_1: [
    {
      id: 'rev_1',
      userName: 'Trần Tuấn Anh',
      userAvatar: 'https://i.pravatar.cc/150?u=rev1',
      userRank: 'Hạng A',
      rating: 5,
      date: '2 ngày trước',
      comment: 'Mặt cỏ rất đẹp, mềm và không bị đau gối. Dàn đèn LED sáng rực rỡ, đá đêm nhìn rõ từng đường bóng!',
    },
    {
      id: 'rev_2',
      userName: 'Lê Văn Hoàng',
      userAvatar: 'https://i.pravatar.cc/150?u=rev2',
      userRank: 'Hạng B',
      rating: 5,
      date: '5 ngày trước',
      comment: 'Chủ sân và nhân viên nhiệt tình, có nước chè nóng và phòng tắm sạch sẽ sau trận.',
    },
    {
      id: 'rev_3',
      userName: 'FC Sông Trà',
      userAvatar: 'https://i.pravatar.cc/150?u=rev3',
      userRank: 'Hạng S',
      rating: 4.8,
      date: '1 tuần trước',
      comment: 'Sân 7 kích thước chuẩn thi đấu, bãi đỗ ô tô thoải mái cho cả 2 đội.',
    },
  ],
};
