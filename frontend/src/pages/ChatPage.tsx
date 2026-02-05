import { FormEvent, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { apiClient } from '../services/apiClient';
import { FaPaperPlane, FaLeaf, FaRobot, FaUser, FaSmile, FaSignOutAlt } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp?: string;
  citations?: Array<{
    source: string;
    relevance_score: number;
  }>;
};

let socket: Socket;

const SUGGESTED_QUESTIONS = [
  "What are the best herbs for Vata imbalance?",
  "How to improve digestion naturally?",
  "Tell me about Ashwagandha benefits.",
  "What is my body type (Dosha)?"
];

export function ChatPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Load history
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/chat/history');
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };
    fetchHistory();

    // Initialize socket connection
    socket = io('http://localhost:2021', {
      withCredentials: true
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    socket.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop_typing', () => setIsTyping(false));

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Emit message to server
    socket.emit('send_message', {
      content: userMessage.content,
      userId: userId
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="min-h-screen bg-ayur-bg font-body flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ayur-gradient rounded-full flex items-center justify-center text-white shadow-md">
            <FaLeaf />
          </div>
          <div>
            <h1 className="font-heading font-bold text-ayur-dark text-lg leading-tight">AyuSuvidha Assistant</h1>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online & Ready</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-ayur-muted hover:text-red-500 transition px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-medium"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col border border-ayur-secondary/20 relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ayur-light/30">
            {messages.length === 0 && (
              <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-20">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                  <FaLeaf />
                </div>
                <h3 className="text-lg font-bold text-ayur-dark mb-2">Welcome to AyuSuvidha</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your personal Ayurvedic health companion. Ask about doshas, remedies, or upload texts for analysis.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-white border border-ayur-secondary/30 p-3 rounded-xl hover:bg-ayur-primary hover:text-white transition shadow-sm text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.sender === 'user' ? 'bg-ayur-dark text-white' : 'bg-ayur-primary text-white'
                }`}>
                  {m.sender === 'user' ? <FaUser size={12} /> : <FaRobot size={14} />}
                </div>
                
                <div className={`max-w-[80%] space-y-1`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-ayur-dark text-white rounded-tr-none'
                        : 'bg-white text-ayur-text border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                  
                  {/* Citations */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="ml-1 mt-2">
                      <p className="text-[10px] font-bold text-ayur-muted uppercase tracking-wider mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {m.citations.map((cit, idx) => (
                          <span key={idx} className="bg-ayur-secondary/10 border border-ayur-secondary/30 text-ayur-dark text-[10px] px-2 py-1 rounded-md flex items-center gap-1" title={cit.source}>
                            <span className="w-1.5 h-1.5 rounded-full bg-ayur-secondary" />
                            <span className="truncate max-w-[100px]">{cit.source}</span>
                            <span className="opacity-60">({Math.round(cit.relevance_score * 100)}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.timestamp && (
                    <div className={`text-[10px] px-1 ${m.sender === 'user' ? 'text-right text-gray-400' : 'text-left text-gray-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-ayur-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FaRobot size={14} />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-ayur-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-ayur-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-ayur-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-gray-100 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 z-20 shadow-xl rounded-xl">
                <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto relative items-center">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 text-ayur-muted hover:text-ayur-primary transition hover:bg-ayur-light rounded-full"
              >
                <FaSmile className="text-xl" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  className="w-full bg-ayur-light border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition pr-12"
                  placeholder="Ask about your Dosha, herbs, or remedies..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || !isConnected}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-ayur-primary hover:bg-ayur-primary/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-center text-ayur-muted mt-3">
              AyuSuvidha provides wellness suggestions based on texts. Consult a doctor for medical issues.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



