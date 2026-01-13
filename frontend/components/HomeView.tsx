import React from 'react';

interface HomeViewProps {
  onOpenNewEntry: () => void;
  onOpenCalendar: () => void;
  onAddHabit: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenNewEntry, onOpenCalendar, onAddHabit }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background-dark no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 pb-4 border-b bg-background-dark/80 ios-blur border-slate-800">
            <div className="flex items-center size-10 shrink-0"></div>
            <div className="flex-1 px-4 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">6月12日 星期一</p>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-white">每日习惯</h2>
            </div>
            <div className="flex items-center justify-end">
                <button 
                    onClick={onAddHabit}
                    className="flex items-center justify-center text-white transition-transform rounded-full cursor-pointer size-10 bg-accent-blue luminous-glow active:scale-90"
                >
                    <span className="material-symbols-outlined text-[24px]">add</span>
                </button>
            </div>
        </div>
        
        <div className="pb-32">
            {/* Stats Row */}
            <div className="flex gap-3 p-4">
                <div className="flex flex-col flex-1 gap-1 p-4 border rounded-2xl bg-card-dark border-slate-700/50">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">完成率</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-white">85%</p>
                        <p className="flex items-center text-xs font-bold text-accent-green">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> 5%
                        </p>
                    </div>
                    <div className="w-full mt-3 overflow-hidden rounded-full bg-slate-800 h-1.5">
                        <div className="h-full rounded-full bg-accent-green" style={{width: '85%'}}></div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-1 p-4 border rounded-2xl bg-card-dark border-slate-700/50">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">最佳连续记录</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-white">12 天</p>
                        <p className="text-xs font-bold text-accent-cyan">+2</p>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                        <div className="h-1.5 flex-1 rounded-full bg-accent-cyan"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-accent-cyan"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-accent-cyan"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-slate-800"></div>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="text-lg font-bold tracking-tight text-white">今日目标</h3>
                <button onClick={onOpenCalendar} className="flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-white transition-colors">
                    日历 <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
            </div>

            {/* Habits List */}
            <div className="flex flex-col gap-3 p-4 pt-2">
                
                {/* Hydration Card */}
                <div className="flex flex-col gap-4 p-4 transition-all border shadow-lg rounded-2xl bg-card-dark border-slate-700/50 active:scale-[0.98]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent-cyan text-[20px] fill-current">water_drop</span>
                                <p className="text-base font-bold text-white">喝水</p>
                            </div>
                            <p className="text-xs font-medium text-slate-400">目标: 2.5L • 健康</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-1.5">
                                {[1,1,1,1,0,1,1].map((s, i) => (
                                    <div key={i} className={`size-2 rounded-full ${s ? 'bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-slate-700'}`}></div>
                                ))}
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">一 二 三 四 五 六 日</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="overflow-hidden rounded-full bg-slate-800 h-2.5 w-full">
                                <div className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue" style={{width: '60%'}}></div>
                            </div>
                            <p className="mt-2 text-[10px] font-medium text-slate-400">已完成 1.5L / 2.5L</p>
                        </div>
                        <button className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 gap-1 text-sm font-bold transition-all active:bg-accent-cyan active:text-slate-900">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>记录</span>
                        </button>
                    </div>
                </div>

                {/* Deep Work Card */}
                <div className="flex flex-col gap-4 p-4 border shadow-lg rounded-2xl bg-card-dark border-slate-700/50 border-l-4 border-l-accent-purple">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent-purple text-[20px]">psychology</span>
                                <p className="text-base font-bold text-white">深度工作</p>
                            </div>
                            <p className="text-xs font-medium text-slate-400">目标: 4 小时 • 工作</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-1.5">
                                {[1,1,1,1,1,0,0].map((s, i) => (
                                    <div key={i} className={`size-2 rounded-full ${s ? 'bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-slate-700'}`}></div>
                                ))}
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">一 二 三 四 五 六 日</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center flex-1 h-10 px-4 border rounded-xl bg-slate-800/50 border-slate-700/50">
                            <p className="text-xs text-slate-400">下一场: <span className="text-slate-200">下午 2:00</span></p>
                        </div>
                        <button onClick={onOpenNewEntry} className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-accent-purple text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)] gap-2 text-sm font-bold transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                            <span>开始</span>
                        </button>
                    </div>
                </div>

                {/* Mindfulness Card */}
                <div className="flex items-center justify-between gap-4 p-4 border rounded-2xl bg-accent-green/5 border-accent-green/20">
                    <div className="flex items-center flex-1 gap-4">
                        <div className="flex items-center justify-center border rounded-full size-12 bg-accent-green/10 border-accent-green/20">
                            <span className="material-symbols-outlined text-accent-green">self_improvement</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-base font-bold line-through text-slate-400">冥想</p>
                            <p className="text-accent-green/70 text-[11px] font-bold uppercase tracking-wide">今日已完成</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-slate-900 rounded-full size-10 bg-accent-green luminous-glow-green">
                        <span className="font-bold material-symbols-outlined text-[24px]">check</span>
                    </div>
                </div>

                {/* Reading Card */}
                <div className="flex items-stretch justify-between gap-4 p-4 border shadow-lg rounded-2xl bg-card-dark border-slate-700/50">
                    <div className="flex flex-[2_2_0px] flex-col justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent-pink text-[20px]">auto_stories</span>
                                <p className="text-base font-bold text-white">阅读 20 页</p>
                            </div>
                            <p className="text-xs font-medium leading-normal text-slate-400">书籍: 原子习惯 • 学习</p>
                        </div>
                        <button className="flex min-w-[84px] max-w-fit cursor-pointer items-center justify-center rounded-xl h-9 px-4 bg-accent-pink/10 text-accent-pink border border-accent-pink/20 gap-2 text-xs font-bold mt-4 transition-all active:bg-accent-pink active:text-slate-900">
                            <span className="material-symbols-outlined text-[16px] fill-current">check_circle</span>
                            <span className="truncate">标记完成</span>
                        </button>
                    </div>
                    <div className="w-28 bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl border border-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2FHv2GdTfwep-UskT9ZylQV_RIFnitCxAY_RMTzvFdvGiM3_J5moSzORfn8n5i5vv2OfF4gmkqIS0-4zSdoUjgyJg53b4srQ_X5hEPGJZHtlbl9FZ5sTzMpPbU0HtlkRTKTu1vBrnwIGV9LG6mFrD1BhQLJWbuM9QRbN-WMOxl0Y0FzprHW8XXbehnGGWhCkEecdY0bCWuy55-MPpcpzqQNa_jJH6nIAyqEndgm3XAYeijiguCAlC5a3aSdlc-7YumYFD-4ERYMs")'}}></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HomeView;