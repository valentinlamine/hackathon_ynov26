import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message, ApiSettings, Conversation } from '../../types';
import { generateResponse } from '../../services/api';
import './Chat.css';

interface ChatProps {
  settings: ApiSettings;
  conversation: Conversation | null;
  onUpdateConversation: (id: string, newConv: Partial<Conversation>) => Promise<string>;
  setCurrentId: (id: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ settings, conversation, onUpdateConversation, setCurrentId }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = conversation?.messages || [];
  const convId = conversation?.id;

  const [streamedContent, setStreamedContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamedContent]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
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

    let activeId = convId;
    let newTitle = conversation?.title;
    
    if (!activeId) {
      activeId = Date.now().toString();
      newTitle = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
      setCurrentId(activeId);
    }

    const currentMessages = [...messages, userMessage];
    
    // Save user message to backend and get the real UUID
    activeId = await onUpdateConversation(activeId!, { 
      messages: currentMessages,
      ...(newTitle ? { title: newTitle } : {})
    });
    
    setInput('');
    setIsLoading(true);
    setStreamedContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      let assistantContent = '';
      const fullResponse = await generateResponse(currentMessages, settings, (chunk) => {
        assistantContent += chunk;
        setStreamedContent(assistantContent);
      });

      // Save final assistant message to backend
      const assistantMessageId = (Date.now() + 1).toString();
      onUpdateConversation(activeId!, {
        messages: [
          ...currentMessages,
          { id: assistantMessageId, role: 'assistant', content: fullResponse, timestamp: Date.now() }
        ]
      });

    } catch (error: any) {
      console.error(error);
      onUpdateConversation(activeId!, {
        messages: [
          ...currentMessages,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Error: ${error.message}`,
            timestamp: Date.now(),
          },
        ]
      });
    } finally {
      setIsLoading(false);
      setStreamedContent('');
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
          <p>Start a new conversation below.</p>
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
              {msg.content}
            </div>
          ))}
          
          {isLoading && (
            <div className="message-bubble animate-fade-in message-assistant">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', opacity: 0.8, fontSize: '0.8rem' }}>
                <Bot size={14} />
                Assistant
              </div>
              <span className={!streamedContent ? 'animate-pulse' : ''}>
                {streamedContent || 'Thinking...'}
              </span>
            </div>
          )}
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
