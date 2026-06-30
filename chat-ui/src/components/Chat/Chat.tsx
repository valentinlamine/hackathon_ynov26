import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message, ApiSettings } from '../../types';
import { generateResponse } from '../../services/api';
import './Chat.css';

interface ChatProps {
  settings: ApiSettings;
}

export const Chat: React.FC<ChatProps> = ({ settings }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Add empty assistant message for streaming/loading state
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '', timestamp: Date.now() },
      ]);

      const history = [...messages, userMessage];
      
      const fullResponse = await generateResponse(history, settings, (chunk) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });

      // If not streaming or just to be safe, update the final content
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fullResponse }
            : msg
        )
      );
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <Bot className="empty-state-icon" />
          <h2>TechCorp AI Assistant</h2>
          <p>Model: {settings.model} ({settings.type})</p>
          <p>How can I help you today?</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble animate-fade-in ${
                msg.role === 'user' ? 'message-user' : 'message-assistant'
              }`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', opacity: 0.8, fontSize: '0.8rem' }}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              {msg.content || (msg.role === 'assistant' && isLoading ? (
                <span className="animate-pulse">Thinking...</span>
              ) : '')}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container glass-panel">
        <div className="input-form">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
