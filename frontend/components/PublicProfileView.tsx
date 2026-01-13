import React, { useState, useRef, useEffect } from 'react';

interface PublicProfileViewProps {
  onBack: () => void;
  onMessage: () => void;
}

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ onBack, onMessage }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const posts = [
      {
          id: 1,
          type: 'image',
          time: '2小时前',
          tag: '#深度工作',
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU1zLbyLDZXLkmSGQyoESgNhTEKl4cwvXAXulmdDRkLligedngkQ9-N4wPauKy1gZrv9Q7C_VKY9GO9eAToaZedaiUoBV5h1fFy5gUQQ-jN7IF4TDqP_k0m3CUZNFc6_5ab-BnxgAKyCmcUVWBye7o3soYCcA31F1J7QSYJNWeCyrq_ecJ1Sduk3k46xO5l6covjeSKXfkRTc-E-vpwyvGkOTdVJwaUGuKJmTyDVv8wwWaPQ3znyCh59FVkaDpwqYB7swAb0pbCYE",
          title: '我的深度工作桌面设置',
          content: '整洁的设置有助于我集中注意力。今天使用番茄工作法来攻克新项目的后端开发。',
          likes: 124,
          comments: 18
      },
      {
          id: 2,
          type: 'text',
          time: '1天前',
          tag: '#心态',
          content: '"专注就像肌肉。你用得越多，它就越强壮。"',
          likes: 452,
          comments: 34
      },
      {
          id: 3,
          type: 'image',
          time: '3天前',
          tag: '#阅读',
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2FHv2GdTfwep-UskT9ZylQV_RIFnitCxAY_RMTzvFdvGiM3_J5moSzORfn8n5i5vv2OfF4gmkqIS0-4zSdoUjgyJg53b4srQ_X5hEPGJZHtlbl9FZ5sTzMpPbU0HtlkRTKTu1vBrnwIGV9LG6mFrD1BhQLJWbuM9QRbN-WMOxl0Y0FzprHW8XXbehnGGWhCkEecdY0bCWuy55-MPpcpzqQNa_jJH6nIAyqEndgm3XAYeijiguCAlC5a3aSdlc-7YumYFD-4ERYMs",
          title: '周末阅读时间',
          content: '重读《原子习惯》。每次读都有新收获。',
          likes: 89,
          comments: 12
      },
      {
          id: 4,
          type: 'text',
          time: '4天前',
          tag: '#复盘',
          content: '本周效率提升 20%。关键在于减少上下文切换。',
          likes: 231,
          comments: 28
      },
      {
          id: 5,
          type: 'image',
          time: '5天前',
          tag: '#咖啡',
          image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          title: '早晨的第一杯咖啡',
          content: '没有咖啡的早晨是不完整的。',
          likes: 156,
          comments: 22
      },
      {
          id: 6,
          type: 'text',
          time: '6天前',
          tag: '#计划',
          content: '制定好下周的计划是成功的一半。',
          likes: 189,
          comments: 15
      }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f18]/85 backdrop-blur-xl border-b border-[#232f48]">
        <div className="flex items-center p-4 justify-between relative">
          <button onClick={onBack} className="flex items-center justify-center rounded-full h-10 w-10 bg-[#161e2d] text-white hover:bg-[#232f48] transition-colors border border-[#232f48]">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-base font-bold leading-tight tracking-tight flex-1 text-center">@alex_prod</h2>
          <div className="flex w-10 items-center justify-end relative">
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center justify-center rounded-lg h-10 w-10 transition-colors ${showMenu ? 'text-white bg-[#232f48]' : 'text-slate-300 hover:text-white'}`}
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            
            {showMenu && (
                <div ref={menuRef} className="absolute top-12 right-0 w-48 bg-[#161e2d] border border-[#232f48] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-white group">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white transition-colors">ios_share</span>
                        <span className="text-sm font-medium">分享主页</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-white border-t border-[#232f48] group">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white transition-colors">block</span>
                        <span className="text-sm font-medium">拉黑用户</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-500/10 transition-colors text-red-500 border-t border-[#232f48] group">
                        <span className="material-symbols-outlined text-[20px] group-hover:text-red-400 transition-colors">report</span>
                        <span className="text-sm font-medium">举报</span>
                    </button>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-32">
        {/* Profile Info */}
        <section className="px-5 pt-6 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="size-24 rounded-full bg-cover bg-center ring-4 ring-[#135bec]/20 p-1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw')" }}>
                <div className="w-full h-full rounded-full bg-cover bg-center border-2 border-[#0a0f18]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw')" }}></div>
              </div>
              <div className="absolute bottom-0 right-0 size-6 bg-green-500 border-4 border-[#0a0f18] rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Alex Rivera</h1>
            <p className="text-slate-400 text-sm font-medium mb-3">@alex_prod</p>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs mb-6">
              产品设计师 & 深度工作爱好者。构建专注的未来。 ☕️ + 💻
            </p>
            <div className="flex gap-4 w-full mb-6">
              <button className="flex-1 bg-[#135bec] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#135bec]/20 active:scale-95">
                关注
              </button>
              <button 
                onClick={onMessage}
                className="px-4 bg-[#161e2d] hover:bg-slate-700 text-white border border-[#232f48] rounded-xl transition-all active:scale-95 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
            <div className="flex justify-between w-full px-4 py-2 bg-[#161e2d]/50 rounded-2xl border border-[#232f48]">
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">1.2k</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">粉丝</p>
              </div>
              <div className="w-px bg-[#232f48] h-8 self-center"></div>
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">842</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">关注</p>
              </div>
              <div className="w-px bg-[#232f48] h-8 self-center"></div>
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">156</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">帖子</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pinned Tip */}
        <section className="px-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#135bec] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>keep</span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">置顶技巧</h3>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#161e2d] to-[#0a0f18] border border-[#135bec]/30 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">lightbulb</span>
            </div>
            <h4 className="text-white font-bold mb-2 relative z-10">4小时深度工作模块</h4>
            <p className="text-slate-300 text-sm leading-relaxed relative z-10">
              我从早上6点开始，进行一个4小时的不受打扰的专注模块。没有 Slack，没有邮件，没有会议。这占了我日常产出的80%。
            </p>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="px-2 py-1 bg-[#135bec]/10 text-[#135bec] text-[10px] font-bold rounded border border-[#135bec]/20">#深度工作</span>
              <span className="px-2 py-1 bg-[#135bec]/10 text-[#135bec] text-[10px] font-bold rounded border border-[#135bec]/20">#策略</span>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">帖子</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'text-[#135bec] bg-[#232f48]' : 'text-slate-400 hover:text-white'}`}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'text-[#135bec] bg-[#232f48]' : 'text-slate-400 hover:text-white'}`}
              >
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </button>
            </div>
          </div>
          
          {viewMode === 'list' ? (
              <div className="space-y-4">
                {posts.map(post => (
                    <article key={post.id} className="p-4 bg-[#161e2d] rounded-2xl border border-[#232f48] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-8 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw')" }}></div>
                        <div>
                          <h3 className="text-sm font-bold text-white">@alex_prod</h3>
                          <p className="text-[10px] text-slate-400">{post.time} • {post.tag}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        {post.type === 'image' ? (
                             <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl ring-1 ring-white/5" style={{ backgroundImage: `url('${post.image}')` }}></div>
                        ) : (
                             <div className="p-4 rounded-xl bg-[#135bec]/5 border border-[#135bec]/10">
                                <p className="text-white text-sm font-medium leading-relaxed italic">{post.content}</p>
                             </div>
                        )}
                        
                        {(post.type === 'image' || post.title) && (
                            <div className="flex flex-col gap-1.5">
                                {post.title && <h4 className="text-white text-base font-bold leading-tight">{post.title}</h4>}
                                <p className="text-slate-400 text-sm font-normal leading-relaxed">{post.content}</p>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-4 py-1">
                          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#232f48] text-slate-300">
                            <span className="material-symbols-outlined text-[18px]">pan_tool</span>
                            <span className="text-xs font-bold">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#232f48] text-slate-300">
                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            <span className="text-xs font-bold">{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
          ) : (
              <div className="grid grid-cols-3 gap-0.5 animate-in fade-in zoom-in-95 duration-300">
                {posts.map(post => (
                    <div key={post.id} className="relative aspect-square bg-[#161e2d] cursor-pointer group overflow-hidden">
                        {post.type === 'image' ? (
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${post.image}')` }}></div>
                        ) : (
                            <div className="w-full h-full p-2 flex items-center justify-center bg-[#135bec]/5 border border-[#232f48]">
                                <p className="text-[9px] text-slate-300 line-clamp-4 text-center italic leading-relaxed">{post.content}</p>
                            </div>
                        )}
                        {/* Type Icon Overlay */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {post.type === 'image' ? (
                                <span className="material-symbols-outlined text-white text-[16px] drop-shadow-md">image</span>
                            ) : (
                                <span className="material-symbols-outlined text-white text-[16px] drop-shadow-md">format_quote</span>
                            )}
                        </div>
                    </div>
                ))}
              </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PublicProfileView;