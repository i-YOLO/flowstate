import React, { useState, useRef, useEffect } from 'react';

interface ChatViewProps {
  onBack: () => void;
  onOpenProfile: () => void;
}

interface Message {
  id: number;
  text?: string;
  image?: string;
  isSender: boolean;
  time: string;
  read?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ onBack, onOpenProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "嘿！你完成了新项目的专注模块了吗？我正准备开始我的。",
      isSender: false,
      time: "上午 10:24"
    },
    {
      id: 2,
      text: "刚完成！成功进行了3小时的深度工作。今天感觉效率很高。 🚀",
      isSender: true,
      time: "上午 10:26",
      read: true
    },
    {
      id: 3,
      text: "不错！看看我今天的设置。调整了一下以减少干扰。",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU1zLbyLDZXLkmSGQyoESgNhTEKl4cwvXAXulmdDRkLligedngkQ9-N4wPauKy1gZrv9Q7C_VKY9GO9eAToaZedaiUoBV5h1fFy5gUQQ-jN7IF4TDqP_k0m3CUZNFc6_5ab-BnxgAKyCmcUVWBye7o3soYCcA31F1J7QSYJNWeCyrq_ecJ1Sduk3k46xO5l6covjeSKXfkRTc-E-vpwyvGkOTdVJwaUGuKJmTyDVv8wwWaPQ3znyCh59FVkaDpwqYB7swAb0pbCYE",
      isSender: false,
      time: "上午 10:28"
    },
    {
      id: 4,
      text: "看起来超级整洁。这种灯光非常适合保持专注。",
      isSender: true,
      time: "上午 10:30",
      read: true
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '🥹', '😍', '🔥', '👍', '👎', '🎉', '🚀', '👀', '🤔', '😭', '🤡', '💩', '❤️', '🙏', '💪', '✨', '💤', '☕️'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "上午").replace("PM", "下午"),
      read: false
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMessage: Message = {
          id: Date.now(),
          image: reader.result as string,
          isSender: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "上午").replace("PM", "下午"),
          read: false
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f18]/85 backdrop-blur-xl border-b border-[#232f48]">
        <div className="flex items-center px-4 py-3 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-slate-300 -ml-1 hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onOpenProfile}
            >
                <div className="relative">
                  <div className="size-10 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw')" }}></div>
                  <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-[#0a0f18] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-white text-base font-bold leading-tight">Alex Rivera</h2>
                  <p className="text-[11px] text-green-500 font-medium">在线</p>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white transition-colors">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button 
                onClick={onOpenProfile}
                className="text-slate-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#0a0f18]">
        <div className="flex flex-col items-center justify-center mb-4">
          <span className="px-3 py-1 bg-[#232f48]/50 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wider">今天</span>
        </div>

        {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isSender ? 'ml-auto flex-row-reverse' : ''}`}>
                 {/* Avatar only for receiver */}
                 {!msg.isSender && (
                     <div 
                        onClick={onOpenProfile}
                        className="size-8 rounded-full bg-cover bg-center shrink-0 mt-auto cursor-pointer hover:opacity-80 transition-opacity" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw')" }}
                     ></div>
                 )}

                 <div className={`flex flex-col gap-1 ${msg.isSender ? 'items-end' : ''}`}>
                    <div className={`
                        p-3 rounded-2xl text-sm leading-relaxed overflow-hidden
                        ${msg.isSender 
                            ? 'bg-[#135bec] text-white rounded-br-none' 
                            : 'bg-[#232f48] text-slate-100 rounded-bl-none'}
                        ${msg.image ? 'p-2' : ''}
                    `}>
                        {msg.image && (
                             <div className="w-full rounded-xl bg-cover bg-center mb-2" style={{ backgroundImage: `url('${msg.image}')` }}>
                                <img src={msg.image} className="w-full h-auto opacity-0" alt="attachment" />
                             </div>
                        )}
                        {msg.text && (
                            <p className={msg.image ? 'px-1 pb-1' : ''}>{msg.text}</p>
                        )}
                    </div>
                    <div className={`flex items-center gap-1 ${msg.isSender ? 'mr-1' : 'ml-1'}`}>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                        {msg.isSender && (
                             <span className={`material-symbols-outlined text-[14px] ${msg.read ? 'text-[#135bec] filled' : 'text-slate-500'}`}>done_all</span>
                        )}
                    </div>
                 </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="bg-[#0a0f18]/95 backdrop-blur-xl border-t border-[#232f48] px-4 py-3 pb-8 relative">
        {/* Emoji Picker */}
        {showEmojiPicker && (
            <div 
                ref={emojiPickerRef}
                className="absolute bottom-24 right-4 bg-[#161e2d] border border-[#232f48] rounded-2xl shadow-xl p-3 grid grid-cols-5 gap-2 w-64 animate-in fade-in slide-in-from-bottom-2 z-50"
            >
                {emojis.map(emoji => (
                    <button 
                        key={emoji} 
                        onClick={() => handleAddEmoji(emoji)}
                        className="size-10 flex items-center justify-center text-xl hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        )}

        <div className="flex items-end gap-2">
          {/* File Input Hidden */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center size-10 rounded-full bg-[#232f48] text-slate-300 shrink-0 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <div className="flex-1 bg-[#161e2d] border border-[#232f48] rounded-2xl flex items-end px-3 py-2 min-h-[44px]">
            <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm placeholder:text-slate-500 resize-none py-1 max-h-32 focus:outline-none" 
                placeholder="发消息..." 
                rows={1}
            ></textarea>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(!showEmojiPicker);
                }}
                className={`p-1 transition-colors ${showEmojiPicker ? 'text-[#135bec]' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="material-symbols-outlined">mood</span>
            </button>
          </div>
          <button 
            onClick={handleSend}
            className={`flex items-center justify-center size-10 rounded-full transition-all shadow-lg ${
                inputText.trim() 
                ? 'bg-[#135bec] text-white hover:bg-[#135bec]/90 active:scale-95' 
                : 'bg-[#232f48] text-slate-500 cursor-not-allowed'
            }`}
            disabled={!inputText.trim()}
          >
            <span className="material-symbols-outlined filled">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;