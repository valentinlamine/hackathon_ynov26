import React from 'react';
import { Plus, MessageSquare, LogOut, X, Trash2 } from 'lucide-react';
import type { Conversation, User } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  user,
  onLogout,
  isOpen,
  onClose,
}) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNew}>
          <Plus size={18} />
          New Chat
        </button>
        {/* Mobile close button inside header if needed, but usually handled externally. Add just in case */}
        <button className="close-button" onClick={onClose} style={{ display: 'none' /* toggle via media query if wanted */ }}>
          <X size={20} />
        </button>
      </div>
      
      <div className="conversations-list">
        {conversations.map((conv) => (
          <div key={conv.id} className={`conversation-item-wrapper ${conv.id === currentId ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
            <button
              className={`conversation-item ${conv.id === currentId ? 'active' : ''}`}
              onClick={() => onSelect(conv.id)}
              style={{ flex: 1 }}
            >
              <MessageSquare size={16} />
              <span className="conversation-title">
                {conv.title || 'New Chat'}
              </span>
            </button>
            <button 
              className="delete-chat-btn" 
              onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.6 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <span className="user-name">{user.username}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};
