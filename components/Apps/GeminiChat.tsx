import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { generateStreamResponse } from '../../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const GeminiChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am your Ubuntu AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Add placeholder for AI response
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      
      const stream = generateStreamResponse(userMsg);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'ai', text: fullResponse };
          return newHistory;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-ubuntu-orange text-white rounded-tr-none' : 'bg-gray-700 text-gray-100 rounded-tl-none'
              }`}>
                {msg.text ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                    <div className="flex space-x-1 items-center h-5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      
      <div className="p-4 bg-[#222] border-t border-gray-800">
        <div className="flex items-center space-x-2 bg-[#333] rounded-full px-4 py-2 border border-gray-700 focus-within:border-purple-500 transition-colors">
          <Sparkles size={18} className="text-purple-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Gemini AI..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-ubuntu-orange rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};