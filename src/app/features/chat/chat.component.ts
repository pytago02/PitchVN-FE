import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Standalone Modules
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { 
  MOCK_CONVERSATIONS, 
  MOCK_CONTACTS, 
  ChatConversation, 
  ChatMessage, 
  ChatContact 
} from './mock-chat.data';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // ── Scroll container DOM ref ─────────────────────────────
  @ViewChild('messageHistoryScroll') private scrollContainer!: ElementRef;

  // ── States (Signals) ──────────────────────────────────────
  conversations = signal<ChatConversation[]>(MOCK_CONVERSATIONS);
  selectedConversation = signal<ChatConversation | null>(null);
  searchQuery = signal<string>('');
  contactSearchQuery = signal<string>('');
  showNewChatDialog = signal<boolean>(false);
  showInfoPanel = signal<boolean>(false);
  
  messageText = '';

  // ── Computed: Filters Conversations (Inbox) ──────────────
  filteredConversations = computed<ChatConversation[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.conversations();
    
    return this.conversations().filter(conv => 
      conv.name.toLowerCase().includes(query) || 
      conv.lastMessage.toLowerCase().includes(query)
    );
  });

  // ── Computed: Filters Contacts (New Chat Popup) ──────────
  filteredContacts = computed<ChatContact[]>(() => {
    const query = this.contactSearchQuery().trim().toLowerCase();
    if (!query) return MOCK_CONTACTS;

    return MOCK_CONTACTS.filter(contact => 
      contact.name.toLowerCase().includes(query) || 
      contact.handle.toLowerCase().includes(query) ||
      contact.role.toLowerCase().includes(query)
    );
  });

  // ── Action Handlers ──────────────────────────────────────
  selectConversation(conv: ChatConversation) {
    // Reset unread count on select
    this.conversations.update(prev => 
      prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
    );

    // Update active selected conversation reference
    this.selectedConversation.set(conv);
    
    // Close detail panel when swapping chats for better UX
    this.showInfoPanel.set(false);
    
    this.scrollToBottom();
  }

  deselectConversation() {
    this.selectedConversation.set(null);
    this.showInfoPanel.set(false);
  }

  sendMessage() {
    if (!this.messageText.trim()) return;

    const activeConv = this.selectedConversation();
    if (!activeConv) return;

    const newMsgText = this.messageText.trim();
    
    // Create new ChatMessage structure
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'p2', // 'p2' is Tuấn Hải (the current logged-in player)
      senderName: 'Phạm Tuấn Hải',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: newMsgText,
      timestamp: this.getCurrentFormattedTime()
    };

    // Update state optimistically
    this.updateActiveConversationMessages(activeConv.id, newMsg, newMsgText);

    // Reset input textbox
    this.messageText = '';
    this.scrollToBottom();
  }

  mockAttachImage() {
    const activeConv = this.selectedConversation();
    if (!activeConv) return;

    const newMsg: ChatMessage = {
      id: 'msg_img_' + Date.now(),
      senderId: 'p2',
      senderName: 'Phạm Tuấn Hải',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: 'Gửi anh em ảnh sơ đồ chiến thuật sân Thành Phát tối nay nhé! ⚽📋',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80',
      timestamp: this.getCurrentFormattedTime()
    };

    this.updateActiveConversationMessages(activeConv.id, newMsg, 'Gửi anh em ảnh sơ đồ...');
    this.scrollToBottom();
  }

  private updateActiveConversationMessages(convId: string, message: ChatMessage, snippetText: string) {
    this.conversations.update(prevList => {
      // 1. Map messages to targeted conversation
      const updatedList = prevList.map(c => {
        if (c.id === convId) {
          const updatedMessages = [...c.messages, message];
          return {
            ...c,
            messages: updatedMessages,
            lastMessage: snippetText,
            lastMessageTime: message.timestamp
          };
        }
        return c;
      });

      // 2. Put the active conversation at the top of the inbox list
      const activeIdx = updatedList.findIndex(c => c.id === convId);
      if (activeIdx > 0) {
        const [activeItem] = updatedList.splice(activeIdx, 1);
        return [activeItem, ...updatedList];
      }

      return updatedList;
    });

    // Sync selected conversation object reference to re-render chat container
    const freshConv = this.conversations().find(c => c.id === convId);
    if (freshConv) {
      this.selectedConversation.set(freshConv);
    }
  }

  // ── Starting New Conversations ───────────────────────────
  openNewChatDialog() {
    this.contactSearchQuery.set('');
    this.showNewChatDialog.set(true);
  }

  closeNewChatDialog() {
    this.showNewChatDialog.set(false);
  }

  startNewChat(contact: ChatContact) {
    // Check if conversation already exists in active list
    const existing = this.conversations().find(c => 
      c.type === 'direct' && c.messages.some(m => m.senderId === contact.id || m.senderId === 'p2') && c.name === contact.name
    );

    if (existing) {
      this.selectConversation(existing);
    } else {
      // Create new ChatConversation structure
      const newConv: ChatConversation = {
        id: 'c_' + Date.now(),
        name: contact.name,
        avatar: contact.avatar,
        type: contact.role === 'Đội bóng' ? 'group' : 'direct',
        status: contact.role === 'Đội bóng' ? '5 thành viên' : 'online',
        unreadCount: 0,
        messages: [],
        lastMessage: 'Bắt đầu cuộc trò chuyện mới',
        lastMessageTime: 'Vừa xong'
      };

      // Prepend to conversation list state
      this.conversations.update(prev => [newConv, ...prev]);
      this.selectConversation(newConv);
    }

    this.closeNewChatDialog();
    this.scrollToBottom();
  }

  // ── Info Panel Details Helpers ───────────────────────────
  toggleInfoPanel() {
    this.showInfoPanel.update(v => !v);
  }

  getSharedImages(): string[] {
    const conv = this.selectedConversation();
    if (!conv) return [];
    return conv.messages.filter(m => m.image).map(m => m.image as string);
  }

  mockDeleteChat() {
    const conv = this.selectedConversation();
    if (!conv) return;

    // Reset messages list for targeted chat
    this.conversations.update(prevList => 
      prevList.map(c => c.id === conv.id ? {
        ...c,
        messages: [],
        lastMessage: 'Lịch sử trò chuyện đã được xóa',
        lastMessageTime: this.getCurrentFormattedTime()
      } : c)
    );

    // Update current selected model sync
    const fresh = this.conversations().find(c => c.id === conv.id);
    if (fresh) {
      this.selectedConversation.set(fresh);
    }

    this.showInfoPanel.set(false);
  }

  // ── Scroll Helpers ───────────────────────────────────────
  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }

  private getCurrentFormattedTime(): string {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  }
}
