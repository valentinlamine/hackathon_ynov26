import { useState, useEffect } from 'react';
import { Menu, Zap } from 'lucide-react';
import { Chat } from './components/Chat/Chat';
import { Settings } from './components/Settings/Settings';
import type { ApiSettings } from './types';
import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('techcorp-chat-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
    return {
      type: 'ollama',
      url: 'http://localhost:11434',
      model: 'phi3.5-financial',
    };
  });

  useEffect(() => {
    localStorage.setItem('techcorp-chat-settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="app-layout">
      <main className="main-content">
        <header className="header glass-panel">
          <div className="logo">
            <Zap className="logo-accent" size={24} />
            TechCorp <span className="text-secondary font-light">AI Chat</span>
          </div>
          <button 
            className="menu-button"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Menu size={24} />
          </button>
        </header>
        
        <div className="chat-area">
          <Chat settings={settings} />
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
