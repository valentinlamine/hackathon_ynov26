import type { ApiSettings, Message } from '../types';

export const generateResponse = async (
  messages: Message[],
  settings: ApiSettings,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  if (settings.type === 'ollama') {
    return generateOllamaResponse(messages, settings, onChunk);
  } else if (settings.type === 'triton') {
    return generateTritonResponse(messages, settings, onChunk);
  } else {
    // Custom
    return generateCustomResponse(messages, settings, onChunk);
  }
};

const generateOllamaResponse = async (
  messages: Message[],
  settings: ApiSettings,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const url = `${settings.url.replace(/\/$/, '')}/api/chat`;
  
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model || 'phi3.5-financial',
        messages: formattedMessages,
        stream: !!onChunk,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              const contentChunk = data.message.content;
              fullContent += contentChunk;
              onChunk(contentChunk);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
      return fullContent;
    } else {
      const data = await response.json();
      return data.message?.content || '';
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to communicate with Ollama server. Check if it is running and CORS is configured.');
  }
};

const generateTritonResponse = async (
  _messages: Message[],
  _settings: ApiSettings,
  _onChunk?: (chunk: string) => void
): Promise<string> => {
  // Mock triton request - in reality it depends on the Triton model configuration
  // Usually it expects an input tensor and returns an output tensor
  // We'll throw an alert that it's basic implementation for now
  throw new Error("Triton implementation requires specific model tensor configuration. Please use Ollama or Custom for standard REST APIs.");
};

const generateCustomResponse = async (
  messages: Message[],
  settings: ApiSettings,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const url = settings.url;
  
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        stream: !!onChunk
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.content) {
                fullContent += data.content;
                onChunk(data.content);
              }
            } catch (e) {
              // Ignore invalid JSON chunks
            }
          }
        }
      }
      return fullContent;
    } else {
      const data = await response.json();
      return data.response || data.content || JSON.stringify(data);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to communicate with Custom server.');
  }
};
