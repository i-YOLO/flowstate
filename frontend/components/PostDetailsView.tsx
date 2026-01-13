import React, { useRef, useState, useEffect } from 'react';

interface PostDetailsViewProps {
  onBack: () => void;
  onReply: () => void;
  onOpenProfile: () => void;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
  timestamp: number;
}

const PostDetailsView: React.FC<PostDetailsViewProps> = ({ onBack, onReply, onOpenProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'top'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Initial Comments Data with timestamps
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: '@sarah_habits',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqq9s2sFly0RfMuc1FxxXrUnZnyVq4VCINlXjcwpLa77u-W3qXOQUwV00CcRSewudq74v1W_Td9Dtgps0Y5KC51SS5dHt29v6IEmIVSXayoEIKP8e8y9yCjjpcS_3-bTHUaHO0m80rspdOsnk3fOkdThy15RKj5pkbmoPXVXXR9yOxjP8-WLIcPzW9PLaMQ_tu2eacCtgpsCfvfGmLtsNq88YZtvJs0xLuAe9Fdrh_OxhXJzrxIpMLXwlVbs3_2l-EfV0clOpGZ0',
      time: '1小时前',
      content: '这套装备太棒了！你用的是什么显示器支架？看起来超级整洁。',
      likes: 12,
      isLiked: false,
      timestamp: Date.now() - 3600000 // 1 hour ago
    },
    {
      id: 2,
      user: '@james_dev',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-yqYtREuZLIhl7h3VBhglCijMjGxcYYkE-YZZsZ6lWVp5T3kf0W5hb7ibWIKWRTdi0ZXnQODFbtoic0AzJY5kCtLp3SrMBnDbsYqdoLi-vocOPEotNmeDQm5o5x196XoPD29CFmOkd7Zr-bkx_nGb7sbcBvwBnuv4dYGVlPzW1dzyvrK1lYyR3oppcmwTFSrg1ZDYsfcnNv4ASZ5mVzDn-HDCltnvpAVAuQQmSBQhzM7ZL315odkznxSpM8M2TXiN4Q6pfJICh8',
      time: '45分钟前',
      content: '番茄工作法 + 深度工作简直是绝配。我通常采用 50/10 的间隔。你的节奏是怎样的？',
      likes: 4,
      isLiked: false,
      timestamp: Date.now() - 2700000 // 45 mins ago
    },
    {
      id: 3,
      user: '@you',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw',
      time: '10分钟前',
      content: '看起来很棒 Alex！我正需要学习如何像这样理线 😂',
      likes: 1,
      isLiked: false,
      timestamp: Date.now() - 600000 // 10 mins ago
    }
  ]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: '@you',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw',
      time: '刚刚',
      content: inputText,
      likes: 0,
      isLiked: false,
      timestamp: Date.now()
    };

    setComments(prev => [newComment, ...prev]);
    setInputText('');
  };

  const toggleLike = (id: number) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === id) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  // Sorting Logic
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'newest') return b.timestamp - a.timestamp;
    if (sortOrder === 'oldest') return a.timestamp - b.timestamp;
    if (sortOrder === 'top') return b.likes - a.likes;
    return 0;
  });

  const getSortLabel = () => {
    switch(sortOrder) {
      case 'newest': return '最新';
      case 'oldest': return '最早';
      case 'top': return '最热';
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-menu-container')) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B101B]/90 backdrop-blur-xl border-b border-white/10 shrink-0">
        <div className="flex items-center px-4 h-14 justify-between">
          <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
            <span className="text-sm font-medium">返回</span>
          </button>
          <h2 className="text-white text-base font-bold leading-tight">帖子详情</h2>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Post Content */}
        <div className="px-4 py-4 border-b border-white/5 bg-[#0B101B]">
          <div className="flex items-start gap-3">
            <div 
                className="size-8 rounded-full bg-cover bg-center ring-1 ring-white/10 shrink-0 cursor-pointer" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8nZvNyrRPL5ExOiGvsiulNC65a2R-jjBXqTvvk65sqUgMglP5TBbzylbXjMnVUhzzcI27RlixHtabygziZvwkgCM6dRibTM_1PzxUtetQmzPdIYzdIldMkNqltVn7Hb_ND17RnhmV4n6xj2JD9aAapj7YLPz1yxs6HcWxU2bzq2c9RAf1dFBUph1ohAYBmyFZFcFhxZQEzvrZ--6ALeSWL5oiMnjLSICnfVPW259rTAi5uQGzLbpTqf9_29IFaXeaB8WiPWQEN6w')" }}
                onClick={onOpenProfile}
            ></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 
                    className="text-sm font-bold text-white cursor-pointer hover:underline"
                    onClick={onOpenProfile}
                >@alex_prod</h3>
                <span className="text-[11px] text-slate-500">2小时前</span>
              </div>
              <p className="text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                我的深度工作桌面设置。整洁的环境有助于我集中注意力。今天使用番茄工作法来攻克新项目的后端开发。 #桌面设置
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-4 py-6 space-y-4">
          <div className="flex items-center justify-between mb-2 px-1 relative z-10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">评论 ({comments.length})</h4>
            
            {/* Sort Menu */}
            <div className="relative sort-menu-container">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSortMenu(!showSortMenu);
                    }}
                    className="text-xs font-medium text-primary flex items-center gap-1 active:opacity-70 transition-opacity"
                >
                    {getSortLabel()} 
                    <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {showSortMenu && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#161e2d] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => { setSortOrder('newest'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5 ${sortOrder === 'newest' ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
                        >
                            最新
                        </button>
                        <button 
                            onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5 ${sortOrder === 'oldest' ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
                        >
                            最早
                        </button>
                        <button 
                            onClick={() => { setSortOrder('top'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5 ${sortOrder === 'top' ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
                        >
                            最热
                        </button>
                    </div>
                )}
            </div>
          </div>

          {sortedComments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-2xl border border-white/5 shadow-sm bg-[#161e2d66] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3">
                <div 
                  className="size-9 rounded-full bg-cover bg-center ring-1 ring-white/10" 
                  style={{ backgroundImage: `url('${comment.avatar}')` }}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{comment.user}</h4>
                    <span className="text-[11px] text-slate-500">{comment.time}</span>
                  </div>
                  <p className="text-[13px] text-slate-200 mt-1 leading-normal">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1 transition-all active:scale-95 ${comment.isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-white'}`}
                    >
                      <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${comment.isLiked ? 'filled scale-110' : ''}`}>thumb_up</span>
                      <span className="text-[11px] font-bold">{comment.likes}</span>
                    </button>
                    <button onClick={onReply} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                      <span className="text-[11px] font-bold">回复</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0B101B] border-t border-white/10 px-4 py-3 pb-8 max-w-md mx-auto z-20">
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <button 
            onClick={handleImageClick}
            className="flex items-center justify-center size-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">image</span>
          </button>
          <div className="flex-1 relative">
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-11 bg-slate-800/50 border-none rounded-2xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary/50 focus:outline-none" 
                placeholder="写下你的评论..." 
                type="text"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <button 
            onClick={handleSend}
            className={`size-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${inputText.trim() ? 'bg-primary text-white shadow-primary/20 scale-100' : 'bg-slate-800 text-slate-500 scale-95'}`}
          >
            <span className="material-symbols-outlined text-[20px] filled">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PostDetailsView;