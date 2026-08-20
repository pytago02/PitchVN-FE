export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  image?: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group';
  status: 'online' | 'offline' | string;
  unreadCount: number;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
}

export interface ChatContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'Cầu thủ' | 'Chủ sân' | 'Đội bóng';
}

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'c1',
    name: 'Nguyễn Văn Quyết',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'direct',
    status: 'online',
    unreadCount: 0,
    messages: [
      {
        id: 'm1_1',
        senderId: 'p1',
        senderName: 'Nguyễn Văn Quyết',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Chào Hải, tối thứ 6 này bên em rảnh giao lưu trận không?',
        timestamp: '15:20'
      },
      {
        id: 'm1_2',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Dạ rảnh anh ơi. Đội anh muốn đá sân nào thế ạ?',
        timestamp: '15:22'
      },
      {
        id: 'm1_3',
        senderId: 'p1',
        senderName: 'Nguyễn Văn Quyết',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Sân Thượng Đình nhé, anh đặt từ 19h rồi. Hạng S/A làm trận cọ xát nhiệt chút.',
        timestamp: '15:25'
      },
      {
        id: 'm1_4',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Dạ quá ngon anh ơi. Em chốt kèo nhé, tí em bảo đội trưởng xác nhận trận đấu trên app PitchVN luôn.',
        timestamp: '15:28'
      }
    ],
    lastMessage: 'Dạ quá ngon anh ơi. Em chốt kèo nhé...',
    lastMessageTime: '15:28'
  },
  {
    id: 'c2',
    name: 'FC Mobi (Group)',
    avatar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80',
    type: 'group',
    status: '5 thành viên',
    unreadCount: 1,
    messages: [
      {
        id: 'm2_1',
        senderId: 'p5',
        senderName: 'Nguyễn Tiến Linh',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Anh em tối nay đi đúng giờ nhé, trận gặp FC Mobi bên kia toàn chân cứng đấy.',
        timestamp: '18:10'
      },
      {
        id: 'm2_2',
        senderId: 'p6',
        senderName: 'Đặng Văn Lâm',
        senderAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80',
        content: 'Ok anh, em chuẩn bị găng rồi. Gôn sân Thành Phát đúng không ạ?',
        timestamp: '18:12'
      },
      {
        id: 'm2_3',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Em đang khởi động ở sân rồi. Thời tiết mát mẻ rất đẹp.',
        timestamp: '18:20'
      },
      {
        id: 'm2_4',
        senderId: 'p5',
        senderName: 'Nguyễn Tiến Linh',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Sân đây đúng không? Vừa được nâng cấp cỏ mượt phết.',
        timestamp: '18:25',
        image: 'https://images.unsplash.com/photo-1543326301-88543b53fa5e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm2_5',
        senderId: 'p6',
        senderName: 'Đặng Văn Lâm',
        senderAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80',
        content: 'Ok anh, em đang gửi xe, 5 phút nữa lên sân nhé!',
        timestamp: '18:30'
      }
    ],
    lastMessage: 'Đặng Văn Lâm: Ok anh, em đang gửi xe...',
    lastMessageTime: '18:30'
  },
  {
    id: 'c3',
    name: 'Sân bóng Thượng Đình (Chủ sân)',
    avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
    type: 'direct',
    status: 'Hoạt động 2 giờ trước',
    unreadCount: 0,
    messages: [
      {
        id: 'm3_1',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Anh ơi, sân số 3 tối thứ 6 này còn khung 19h không ạ?',
        timestamp: 'Hôm qua'
      },
      {
        id: 'm3_2',
        senderId: 'owner_1',
        senderName: 'Chủ sân Thượng Đình',
        senderAvatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
        content: 'Chào em, còn đúng 1 slot sân 7 em nhé. Em lên app PitchVN đặt để giữ chỗ luôn nha.',
        timestamp: 'Hôm qua'
      },
      {
        id: 'm3_3',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Dạ em đặt online chuyển khoản rồi đấy ạ, anh check giúp em.',
        timestamp: 'Hôm qua'
      },
      {
        id: 'm3_4',
        senderId: 'owner_1',
        senderName: 'Chủ sân Thượng Đình',
        senderAvatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
        content: 'Ok anh nhận được rồi. Đã duyệt confirmed rồi nha em. Chúc đội đá vui vẻ!',
        timestamp: 'Hôm qua'
      }
    ],
    lastMessage: 'Chủ sân: Ok anh nhận được rồi. Đã duyệt...',
    lastMessageTime: 'Hôm qua'
  },
  {
    id: 'c4',
    name: 'Nguyễn Quang Hải',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    type: 'direct',
    status: 'online',
    unreadCount: 0,
    messages: [
      {
        id: 'm4_1',
        senderId: 'p4',
        senderName: 'Nguyễn Quang Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        content: 'Hải ơi, quả cứa lòng chân trái hôm qua của ông đỉnh thực sự!',
        timestamp: '12/08'
      },
      {
        id: 'm4_2',
        senderId: 'p2',
        senderName: 'Phạm Tuấn Hải',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Haha, nhờ quả rót bóng kiến tạo dọn cỗ của ông đấy thôi chứ.',
        timestamp: '12/08'
      }
    ],
    lastMessage: 'Haha, nhờ quả rót bóng kiến tạo dọn cỗ...',
    lastMessageTime: '12/08'
  }
];

export const MOCK_CONTACTS: ChatContact[] = [
  {
    id: 'p1',
    name: 'Nguyễn Văn Quyết',
    handle: 'vanquyet.nguyen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Cầu thủ'
  },
  {
    id: 'p3',
    name: 'Lê Công Vinh',
    handle: 'congvinh.le',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Cầu thủ'
  },
  {
    id: 'p4',
    name: 'Nguyễn Quang Hải',
    handle: 'quanghai.nguyen',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Cầu thủ'
  },
  {
    id: 'owner_2',
    name: 'Chủ Sân Thành Phát',
    handle: 'thanhphat.owner',
    avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
    role: 'Chủ sân'
  },
  {
    id: 't2',
    name: 'FC Thành Đồng',
    handle: 'fcthanhdong',
    avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=150&auto=format&fit=crop&q=80',
    role: 'Đội bóng'
  }
];
