import React, { useState } from 'react';

interface NotificationViewProps {
  onBack: () => void;
  onOpenChat: () => void;
  onOpenPost: () => void;
  onOpenProfile: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ onBack, onOpenChat, onOpenPost, onOpenProfile }) => {
  const [activeTab, setActiveTab] = useState('互动');

  // Initial Data State
  const [notifications, setNotifications] = useState<Record<string, any[]>>({
    '互动': [
        {
            id: 1, 
            type: 'like', 
            user: '@alex_prod',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw",
            textPrefix: '赞了你的帖子',
            content: '"我的深度工作桌面设置"',
            time: '2分钟前',
            highlight: true,
            icon: 'favorite',
            iconBg: 'bg-pink-500'
        },
        {
            id: 2, 
            type: 'comment', 
            user: '@sarah_habits',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEqq9s2sFly0RfMuc1FxxXrUnZnyVq4VCINlXjcwpLa77u-W3qXOQUwV00CcRSewudq74v1W_Td9Dtgps0Y5KC51SS5dHt29v6IEmIVSXayoEIKP8e8y9yCjjpcS_3-bTHUaHO0m80rspdOsnk3fOkdThy15RKj5pkbmoPXVXXR9yOxjP8-WLIcPzW9PLaMQ_tu2eacCtgpsCfvfGmLtsNq88YZtvJs0xLuAe9Fdrh_OxhXJzrxIpMLXwlVbs3_2l-EfV0clOpGZ0",
            textPrefix: '评论:',
            content: '"这也是我整理桌面的方式！"',
            time: '15分钟前',
            highlight: true,
            icon: 'chat_bubble',
            iconBg: 'bg-blue-500'
        },
        {
            id: 3, 
            type: 'follow', 
            user: '@marcus_m',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8nZvNyrRPL5ExOiGvsiulNC65a2R-jjBXqTvvk65sqUgMglP5TBbzylbXjMnVUhzzcI27RlixHtabygziZvwkgCM6dRibTM_1PzxUtetQmzPdIYzdIldMkNqltVn7Hb_ND17RnhmV4n6xj2JD9aAapj7YLPz1yxs6HcWxU2bzq2c9RAf1dFBUph1ohAYBmyFZFcFhxZQEzvrZ--6ALeSWL5oiMnjLSICnfVPW259rTAi5uQGzLbpTqf9_29IFaXeaB8WiPWQEN6w",
            textPrefix: '开始关注你。',
            time: '昨天',
            highlight: false
        }
    ],
    '私信': [
        {
            id: 1, 
            user: 'Alex Rivera',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb0wmTVcIUFg48DsjtKlwTiTScFkk5QSMmHkKfn7W7lwi1fvgTh7K_N4J40jrXMdGDqsJC_1IFMh-r-1XbeUlgV4JO4vi2WafqTtTDIe8FKxWf6EFRZ4dWVWFDL08ebqsz3jUKPJILG7iFWNngKW8LeEMt21hEt4SaJA4gzH10wSkmkmZUgT2SWdRoYdKDZM-3qcbolL4EBBiDi5bASku5NyX6Gxr9dteuQ71zWs4SPrXlaT7rLMs8EGZSbqQfPn2ck8wml9TgGRw",
            message: '看起来超级整洁。这种灯光非常适合...',
            time: '10:30 AM',
            status: 'online',
            unread: true
        },
        {
            id: 2, 
            user: 'Sarah Habits',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEqq9s2sFly0RfMuc1FxxXrUnZnyVq4VCINlXjcwpLa77u-W3qXOQUwV00CcRSewudq74v1W_Td9Dtgps0Y5KC51SS5dHt29v6IEmIVSXayoEIKP8e8y9yCjjpcS_3-bTHUaHO0m80rspdOsnk3fOkdThy15RKj5pkbmoPXVXXR9yOxjP8-WLIcPzW9PLaMQ_tu2eacCtgpsCfvfGmLtsNq88YZtvJs0xLuAe9Fdrh_OxhXJzrxIpMLXwlVbs3_2l-EfV0clOpGZ0",
            message: '下次读书会是什么时候？',
            time: '昨天',
            status: 'offline',
            unread: false
        }
    ],
    '系统': [
        {
            id: 1, 
            type: 'streak', 
            title: '连胜提醒!', 
            text: '你已达成10天生产力连胜。继续保持！',
            time: '3小时前', 
            icon: 'local_fire_department', 
            iconColor: 'text-orange-500', 
            iconBg: 'bg-orange-500/10', 
            border: 'border-orange-500/20'
        },
        {
            id: 2, 
            type: 'reminder', 
            title: '提醒:', 
            text: '月度回顾会议将在15分钟后开始。',
            time: '昨天', 
            icon: 'notifications_active', 
            iconColor: 'text-[#135bec]', 
            iconBg: 'bg-[#135bec]/10', 
            border: 'border-[#135bec]/20'
        }
    ],
    '社区': [
        {
            id: 1, 
            user: '@james_dev',
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE-yqYtREuZLIhl7h3VBhglCijMjGxcYYkE-YZZsZ6lWVp5T3kf0W5hb7ibWIKWRTdi0ZXnQODFbtoic0AzJY5kCtLp3SrMBnDbsYqdoLi-vocOPEotNmeDQm5o5x196XoPD29CFmOkd7Zr-bkx_nGb7sbcBvwBnuv4dYGVlPzW1dzyvrK1lYyR3oppcmwTFSrg1ZDYsfcnNv4ASZ5mVzDn-HDCltnvpAVAuQQmSBQhzM7ZL315odkznxSpM8M2TXiN4Q6pfJICh8",
            time: '5小时前',
            community: '#深度工作'
        }
    ]
  });

  const handleClear = () => {
    setNotifications(prev => ({
        ...prev,
        [activeTab]: []
    }));
  };

  const currentList = notifications[activeTab] || [];

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f18]/85 backdrop-blur-xl border-b border-[#232f48]">
        <div className="flex items-center p-4 justify-between">
          <button onClick={onBack} className="flex w-10 items-center justify-start text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">消息中心</h2>
          <div className="flex w-10 items-center justify-end">
            <button onClick={handleClear} className="text-[#135bec] text-sm font-semibold hover:opacity-80">清空</button>
          </div>
        </div>
        <div className="px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 border-b border-[#232f48]">
            {['互动', '私信', '系统', '社区'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-1 text-sm font-bold whitespace-nowrap transition-colors relative ${
                        activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    {tab}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#135bec] rounded-t-full"></div>
                    )}
                </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-28 no-scrollbar">
        
        {currentList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pb-20 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                <p className="text-sm">暂无消息</p>
            </div>
        )}

        {activeTab === '互动' && currentList.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="px-4 py-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">最新</h3>
                </div>
                <div className="space-y-[1px]">
                  {currentList.map((item) => (
                      item.type === 'follow' ? (
                          <div 
                            key={item.id}
                            onClick={onOpenProfile}
                            className="flex items-start gap-3 p-4 border-b border-[#232f48]/50 bg-[#0a0f18] cursor-pointer hover:bg-[#161e2d] transition-colors"
                          >
                            <div className="size-12 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: `url('${item.avatar}')` }}></div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-300 leading-snug">
                                <span className="font-bold text-white">{item.user}</span> {item.textPrefix}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                            </div>
                          </div>
                      ) : (
                          <div 
                            key={item.id}
                            onClick={onOpenPost}
                            className={`flex items-start gap-3 p-4 border-b border-[#232f48]/50 cursor-pointer transition-colors ${item.highlight ? 'bg-[rgba(19,91,236,0.08)] hover:bg-[rgba(19,91,236,0.12)]' : 'bg-[#0a0f18] hover:bg-[#161e2d]'}`}
                          >
                            <div className="relative">
                              <div className="size-12 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: `url('${item.avatar}')` }}></div>
                              <div className={`absolute -bottom-1 -right-1 size-5 ${item.iconBg} rounded-full flex items-center justify-center ring-2 ring-[#0a0f18]`}>
                                <span className="material-symbols-outlined text-[12px] text-white filled-icon">{item.icon}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-200 leading-snug">
                                <span className="font-bold text-white">{item.user}</span> {item.textPrefix} {item.content}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                            </div>
                            <div className="size-2 w-2 h-2 rounded-full bg-[#135bec] mt-2"></div>
                          </div>
                      )
                  ))}
                </div>
            </div>
        )}

        {activeTab === '私信' && currentList.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {currentList.map((item) => (
                    <div 
                        key={item.id}
                        onClick={onOpenChat} 
                        className={`flex items-center gap-4 p-4 border-b border-[#232f48]/50 hover:bg-[#161e2d] transition-colors cursor-pointer ${item.unread ? 'bg-[rgba(19,91,236,0.05)]' : ''}`}
                    >
                        <div className="relative">
                            <div className="size-14 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: `url('${item.avatar}')` }}></div>
                            <div className={`absolute bottom-0 right-0 size-3.5 border-2 border-[#0a0f18] rounded-full ${item.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-bold text-white truncate">{item.user}</h3>
                                <span className={`text-xs ${item.unread ? 'text-[#135bec] font-medium' : 'text-slate-500'}`}>{item.time}</span>
                            </div>
                            <p className={`text-sm truncate ${item.unread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{item.message}</p>
                        </div>
                        {item.unread && <div className="size-2.5 rounded-full bg-[#135bec]"></div>}
                    </div>
                ))}
            </div>
        )}

        {activeTab === '系统' && currentList.length > 0 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-[1px]">
                  {currentList.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-4 border-b border-[#232f48]/50 bg-[#0a0f18]">
                        <div className={`size-12 rounded-2xl ${item.iconBg} border ${item.border} flex items-center justify-center shrink-0`}>
                          <span className={`material-symbols-outlined ${item.iconColor} filled-icon`}>{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300 leading-snug">
                            <span className="font-bold text-white">{item.title}</span> {item.text}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                      </div>
                  ))}
                </div>
             </div>
        )}

        {activeTab === '社区' && currentList.length > 0 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-[1px]">
                  {currentList.map((item) => (
                      <div 
                        key={item.id}
                        onClick={onOpenPost}
                        className="flex items-start gap-3 p-4 border-b border-[#232f48]/50 bg-[#0a0f18] cursor-pointer hover:bg-[#161e2d] transition-colors"
                      >
                        <div className="relative">
                          <div className="size-12 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: `url('${item.avatar}')` }}></div>
                          <div className="absolute -bottom-1 -right-1 size-5 bg-[#135bec] rounded-full flex items-center justify-center ring-2 ring-[#0a0f18]">
                            <span className="material-symbols-outlined text-[12px] text-white filled-icon">group</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300 leading-snug">
                            <span className="font-bold text-white">{item.user}</span> 刚刚在 <span className="text-[#135bec]">{item.community}</span> 社区发布了帖子。
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                      </div>
                  ))}
                </div>
             </div>
        )}

      </main>
    </div>
  );
};

export default NotificationView;