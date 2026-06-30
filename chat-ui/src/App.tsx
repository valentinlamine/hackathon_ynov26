import { useState, useEffect } from 'react';
import { Menu, Zap } from 'lucide-react';
import { Chat } from './components/Chat/Chat';
import { Settings } from './components/Settings/Settings';
import { Login } from './components/Auth/Login';
import { Sidebar } from './components/Sidebar/Sidebar';
import type { ApiSettings, User, Conversation } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('techcorp-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('techcorp-chat-settings');
    return saved ? JSON.parse(saved) : {
      type: 'ollama',
      url: 'http://localhost:11434',
      model: 'phi3.5-financial',
    };
  });

  // Auth Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('techcorp-user', JSON.stringify(user));
      fetchConversations();
    } else {
      localStorage.removeItem('techcorp-user');
      setConversations([]);
      setCurrentId(null);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('techcorp-chat-settings', JSON.stringify(settings));
  }, [settings]);

  const fetchConversations = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:3001/api/conversations', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      } else if (res.status === 401 || res.status === 403) {
        // Invalid token, logout
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    }
  };

  const handleNewChat = () => {
    setCurrentId(null);
    setSidebarOpen(false);
  };

  const handleUpdateConversation = async (id: string, newConv: Partial<Conversation>): Promise<string> => {
    if (!user?.token) return id;

    // Optimistic UI Update
    setConversations(prev => {
      const exists = prev.find(c => c.id === id);
      if (exists) {
        return prev.map(c => c.id === id ? { ...c, ...newConv, updatedAt: Date.now() } : c);
      } else {
        const createConv: Conversation = {
          id,
          title: newConv.title || 'New Chat',
          messages: newConv.messages || [],
          updatedAt: Date.now(),
        };
        return [createConv, ...prev];
      }
    });

    try {
      const exists = conversations.find(c => c.id === id);
      
      const endpoint = exists 
        ? `http://localhost:3001/api/conversations/${id}` 
        : `http://localhost:3001/api/conversations`;
        
      const method = exists ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newConv)
      });
      
      if (res.ok) {
        const savedConv = await res.json();
        if (!exists) {
           setConversations(prev => prev.map(c => c.id === id ? savedConv : c));
           setCurrentId(savedConv.id);
           return savedConv.id;
        }
        return id;
      } else if (res.status === 401 || res.status === 403) {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to sync conversation', e);
    }
    return id;
  };

  const handleDeleteConversation = async (id: string) => {
    if (!user?.token) return;
    
    // Optimistic delete
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentId === id) {
      setCurrentId(null);
    }
    
    try {
      await fetch(`http://localhost:3001/api/conversations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    } catch (e) {
      console.error('Failed to delete conversation', e);
      fetchConversations(); // restore on error
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const currentConversation = conversations.find(c => c.id === currentId) || null;

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={conversations}
        currentId={currentId}
        onSelect={(id) => { setCurrentId(id); setSidebarOpen(false); }}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        user={user}
        onLogout={() => setUser(null)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="header glass-panel">
          <div className="header-left">
            <button 
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="logo">
              <Zap className="logo-accent" size={24} />
              TechCorp <span className="text-secondary font-light">AI Chat</span>
            </div>
          </div>
          <button 
            className="settings-toggle-btn"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            Settings
          </button>
        </header>
        
        <div className="chat-area">
          <Chat 
            settings={settings} 
            conversation={currentConversation}
            onUpdateConversation={handleUpdateConversation}
            setCurrentId={setCurrentId}
          />
        </div>
      </main>

      <Settings 
        settings={settings} 
        setSettings={setSettings} 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
