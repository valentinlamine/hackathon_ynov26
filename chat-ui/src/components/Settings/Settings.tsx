import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import type { ApiSettings } from '../../types';
import './Settings.css';

interface SettingsProps {
  settings: ApiSettings;
  setSettings: (settings: ApiSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  setSettings,
  isOpen,
  onClose,
}) => {
  const handleChange = (field: keyof ApiSettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-header">
        <h3>
          <SettingsIcon size={20} className="text-accent-primary" />
          Configuration
        </h3>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="form-group">
        <label>API Backend</label>
        <select
          value={settings.type}
          onChange={(e) => handleChange('type', e.target.value as any)}
        >
          <option value="ollama">Ollama (Local)</option>
          <option value="triton">Triton Inference Server</option>
          <option value="custom">Custom API</option>
        </select>
      </div>

      <div className="form-group">
        <label>Endpoint URL</label>
        <input
          type="text"
          value={settings.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="http://localhost:11434"
        />
      </div>

      <div className="form-group">
        <label>Model Name</label>
        <input
          type="text"
          value={settings.model}
          onChange={(e) => handleChange('model', e.target.value)}
          placeholder="phi3.5-financial"
        />
      </div>

      <div className="info-box">
        <p>
          <strong>Note:</strong> Make sure your API server is running and CORS is enabled to allow web requests.
        </p>
      </div>
    </div>
  );
};
