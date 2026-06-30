import React, { useState } from 'react';
import { Zap, Lock, Mail, User as UserIcon } from 'lucide-react';
import type { User } from '../../types';
import './Login.css';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = { email, password };

      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      onLogin({ username: data.user.name || data.user.email, token: data.token });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      // Mock Google Flow using backend endpoint
      const res = await fetch(`http://localhost:3001/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@google.com', name: 'Google Demo User' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLogin({ username: data.user.name, token: data.token });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <h2>
            <Zap className="logo-accent" size={28} />
            TechCorp AI
          </h2>
          <p>{isRegistering ? 'Create your secure account' : 'Sign in to access your secure chat workspace'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={!email.trim() || !password || loading}
          >
            <Lock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
            {isRegistering ? 'Create Account' : 'Authenticate'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          className="google-button"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} />
          Continue with Google
        </button>

        <button 
          className="toggle-mode-btn"
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
        >
          {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};
