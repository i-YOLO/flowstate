import React, { useState } from 'react';

interface ProfileViewProps {
  onBack?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('我的帖子');

  return (
    <div className="h-full overflow-y-auto bg-background-light dark:bg-background-dark no-scrollbar">
       {/* Top Bar */}
       <div className="sticky top-0 z-20 flex items-center justify-between p-4 pb-2 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <button onClick={onBack} className="material-symbols-outlined text-slate-900 dark:text-white cursor-pointer hover:opacity-70 transition-opacity">arrow_back_ios</button>
            <h2 className="flex-1 text-lg font-bold text-center text-slate-900 dark:text-white">个人中心</h2>
            <span className="material-symbols-outlined text-slate-900 dark:text-white cursor-pointer">settings</span>
       </div>

       <div className="pb-24">
           {/* Profile Header */}
           <div className="flex flex-col items-center p-4 gap-4">
                <div className="size-28 rounded-full border-4 border-primary/20 bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBurKfGnhiAjxvRH3dPmlygzYRCuaInHOqS_IGvUyepj4kmfbCKdoc8yqeSZaqbUHcWGOilUzfnCOesklwNsNuTmvpNtmWwfBBGywfeeDGizWnPfbzc6IKa_hGtaFlvPK4orCqoP5rR6zrs9q7mju6EY6RO8IBec8P5Ki6Zg5UVVqI6gvCqLRo_1zb7Oj_Vh5AM8pXxuoc2coFYR-pHJhKZxRrG4E-nXU59ZFl48oLZ0GRXGbh6DwpVkDoRtpPDyks5oSvD9OEZJCE")' }}></div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">Alex Rivera</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">从 2023 年开始优化我的心流状态</p>
                    <p className="text-sm font-medium text-primary">@arivera_flow</p>
                </div>
           </div>

           {/* Stats */}
           <div className="flex gap-3 px-4 py-2">
                <div className="flex-1 p-3 text-center border bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark rounded-xl">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1.2k</p>
                    <p className="text-xs font-medium uppercase text-slate-500">粉丝</p>
                </div>
                <div className="flex-1 p-3 text-center border bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark rounded-xl">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">850</p>
                    <p className="text-xs font-medium uppercase text-slate-500">关注</p>
                </div>
           </div>

           {/* Badges */}
           <div className="flex items-center justify-between px-4 pt-6 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">生产力徽章</h3>
                <span className="text-sm font-semibold cursor-pointer text-primary">查看全部</span>
           </div>
           <div className="flex gap-5 overflow-x-auto px-4 py-3 no-scrollbar">
                {[
                    { name: '早起者', icon: 'light_mode', gradient: 'from-yellow-400 to-orange-500' },
                    { name: '专注大师', icon: 'psychology', gradient: 'from-blue-400 to-primary' },
                    { name: '深度工作', icon: 'nightlight', gradient: 'from-purple-500 to-indigo-600' },
                    { name: '习惯之王', icon: 'crown', gradient: 'from-emerald-400 to-teal-600' },
                ].map(b => (
                    <div key={b.name} className="flex flex-col items-center gap-2 shrink-0 w-16">
                        <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-br ${b.gradient}`}>
                            <span className="material-symbols-outlined text-white text-3xl">{b.icon}</span>
                        </div>
                        <p className="text-[11px] font-medium text-center text-slate-700 dark:text-white">{b.name}</p>
                    </div>
                ))}
                 <div className="flex flex-col items-center gap-2 shrink-0 w-16 opacity-40">
                        <div className="flex items-center justify-center w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full">
                            <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <p className="text-[11px] font-medium text-center text-slate-700 dark:text-white">精英</p>
                </div>
           </div>

           {/* Tabs */}
           <div className="px-4 mt-6">
                <div className="flex p-1 rounded-xl bg-slate-200 dark:bg-surface-dark">
                    {['我的帖子', '成就', '时间统计'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                activeTab === tab 
                                ? 'bg-white shadow-sm dark:bg-primary text-slate-900 dark:text-white' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
           </div>

           {/* Content */}
           <div className="flex flex-col gap-4 p-4">
                <div className="p-4 bg-white border shadow-sm dark:bg-surface-dark border-slate-200 dark:border-border-dark rounded-xl">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center rounded-full size-10 bg-primary/10">
                            <span className="material-symbols-outlined text-primary">timer</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">专注会话</p>
                            <p className="text-xs text-slate-500">2 小时前</p>
                        </div>
                     </div>
                     <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        刚刚完成了 <span className="font-bold text-primary">4小时 深度工作</span> 关于新项目的架构设计。 🚀
                     </p>
                </div>
                <div className="p-4 bg-white border shadow-sm dark:bg-surface-dark border-slate-200 dark:border-border-dark rounded-xl">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center rounded-full size-10 bg-emerald-500/10">
                            <span className="material-symbols-outlined text-emerald-500">task_alt</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">习惯达成</p>
                            <p className="text-xs text-slate-500">昨天</p>
                        </div>
                     </div>
                     <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        正式达成了 <span className="font-bold text-emerald-500">50天</span> 晨间冥想连续记录。
                     </p>
                </div>
           </div>
       </div>
    </div>
  );
};

export default ProfileView;