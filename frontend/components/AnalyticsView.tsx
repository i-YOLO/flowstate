import React, { useState } from 'react';

interface AnalyticsViewProps {
  onBack?: () => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('周');

  // Dummy data for different timeframes to demonstrate tab switching
  const dataMap: Record<string, any> = {
    '日': {
      totalFocus: '6h',
      comparison: '比昨日 +5%',
      deepWork: '4h',
      wellness: '1h',
      admin: '1h',
      consistency: '100%',
      chartValues: [30, 40, 30] // Cyan, Orange, Purple percentages roughly
    },
    '周': {
      totalFocus: '142h',
      comparison: '比上周 +12%',
      deepWork: '64h',
      wellness: '28h',
      admin: '29h',
      consistency: '82%',
      chartValues: [45, 20, 20]
    },
    '月': {
      totalFocus: '520h',
      comparison: '比上月 +8%',
      deepWork: '280h',
      wellness: '120h',
      admin: '120h',
      consistency: '94%',
      chartValues: [55, 25, 20]
    },
    '年': {
      totalFocus: '6,240h',
      comparison: '比去年 +15%',
      deepWork: '3,000h',
      wellness: '1,500h',
      admin: '1,740h',
      consistency: '88%',
      chartValues: [50, 25, 25]
    }
  };

  const currentData = dataMap[activeTab];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background-dark font-display text-white no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background-dark/80 ios-blur border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center w-10">
                <button onClick={onBack} className="flex items-center justify-center transition-colors hover:text-white text-gray-400">
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">统计分析</h1>
            <div className="flex items-center justify-end w-10">
                <span className="cursor-pointer material-symbols-outlined text-2xl text-gray-400">calendar_today</span>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 pb-1">
            <div className="flex gap-8 overflow-x-auto border-b border-white/5 no-scrollbar">
                {['日', '周', '月', '年'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-2 transition-colors min-w-[3rem] ${
                            activeTab === tab 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <p className="text-sm font-bold leading-normal tracking-wide">{tab}</p>
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4 pb-32">
        
        {/* Time Allocation Chart */}
        <section className="p-6 border rounded-2xl bg-card-dark glow-card border-white/5">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-100">时间分配</h3>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">{currentData.comparison}</span>
            </div>
            <div className="flex flex-col items-center gap-10">
                {/* SVG Donut Chart with Glows */}
                <div className="relative flex items-center justify-center w-52 h-52">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Ring */}
                        <circle className="stroke-white/5 fill-none" cx="18" cy="18" r="15.9" strokeWidth="3.5"></circle>
                        {/* Cyan Segment (Deep Work) */}
                        <circle 
                            className="fill-none stroke-primary glow-cyan transition-all duration-500 ease-out" 
                            cx="18" cy="18" r="15.9" 
                            strokeDasharray={`${currentData.chartValues[0]} 100`} strokeDashoffset="0" strokeLinecap="round" strokeWidth="3.5"
                        ></circle>
                        {/* Orange Segment (Wellness) */}
                        <circle 
                            className="fill-none stroke-accent-orange glow-orange transition-all duration-500 ease-out" 
                            cx="18" cy="18" r="15.9" 
                            strokeDasharray={`${currentData.chartValues[1]} 100`} strokeDashoffset={`-${currentData.chartValues[0] + 1}`} strokeLinecap="round" strokeWidth="3.5"
                        ></circle>
                        {/* Purple Segment (Admin) */}
                        <circle 
                            className="fill-none stroke-accent-purple glow-purple transition-all duration-500 ease-out" 
                            cx="18" cy="18" r="15.9" 
                            strokeDasharray={`${currentData.chartValues[2]} 100`} strokeDashoffset={`-${currentData.chartValues[0] + currentData.chartValues[1] + 2}`} strokeLinecap="round" strokeWidth="3.5"
                        ></circle>
                    </svg>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">{currentData.totalFocus}</span>
                        <span className="text-[9px] uppercase font-black tracking-widest text-gray-500 mt-1">总专注时长</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid w-full grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-white/5 border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full size-2.5 bg-primary glow-cyan"></div>
                            <span className="text-sm font-semibold text-gray-300">深度工作</span>
                        </div>
                        <span className="text-sm font-black text-white">{currentData.deepWork}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-white/5 border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full size-2.5 bg-accent-orange glow-orange"></div>
                            <span className="text-sm font-semibold text-gray-300">健康 & 养生</span>
                        </div>
                        <span className="text-sm font-black text-white">{currentData.wellness}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-white/5 border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full size-2.5 bg-accent-purple glow-purple"></div>
                            <span className="text-sm font-semibold text-gray-300">行政 & 后勤</span>
                        </div>
                        <span className="text-sm font-black text-white">{currentData.admin}</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Habit Consistency Bar Chart */}
        <section className="p-6 border rounded-2xl bg-card-dark glow-card border-white/5">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-100">习惯一致性</h3>
                <span className="flex items-center gap-1 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">trending_up</span> {currentData.consistency}
                </span>
            </div>
            <div className="flex items-end justify-between px-1 h-44">
                {[
                    { d: '一', h: 45, c: 'bg-white/10' },
                    { d: '二', h: 80, c: 'bg-accent-purple/40' },
                    { d: '三', h: 120, c: 'bg-primary glow-cyan', active: true },
                    { d: '四', h: 95, c: 'bg-accent-orange/40' },
                    { d: '五', h: 70, c: 'bg-accent-purple/40' },
                    { d: '六', h: 40, c: 'bg-white/10' },
                    { d: '日', h: 55, c: 'bg-white/10' },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center w-8 gap-3">
                        <div 
                            className={`w-full rounded-full transition-all ${item.c}`} 
                            style={{height: `${activeTab === '日' ? Math.random() * 100 + 20 : item.h}px`}}
                        ></div>
                        <p className={`text-[9px] font-black ${item.active ? 'text-primary' : 'text-gray-600'}`}>{item.d}</p>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-xs font-medium italic text-center text-gray-500">
                "您的一致性比平均水平高出 12%。"
            </p>
        </section>

        {/* Weekly Achievement Card */}
        <section className="relative p-6 overflow-hidden rounded-2xl bg-primary glow-card">
            <div className="absolute transform opacity-20 -right-4 -bottom-4 rotate-12">
                <span className="material-symbols-outlined text-[120px] text-black">auto_awesome</span>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg text-black material-symbols-outlined">bolt</span>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">本周成就</h3>
                </div>
                <h2 className="mb-3 text-xl font-black leading-tight text-black">最佳表现日：星期三</h2>
                <p className="mb-5 text-sm font-medium leading-snug text-black/70">
                    您保持了 95% 的任务完成率，并进行了 8.5 小时的深度专注。干得好！
                </p>
                <div className="inline-flex items-center gap-3 px-4 py-2 border bg-black/10 rounded-xl backdrop-blur-md border-black/5">
                    <span className="text-[10px] font-black uppercase text-black/60">生产力指数</span>
                    <span className="text-xl font-black leading-none text-black">98</span>
                </div>
            </div>
        </section>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-5 border rounded-2xl bg-card-dark glow-card border-white/5">
                <p className="mb-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">专注连续天数</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-accent-orange glow-orange">12</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">天</span>
                </div>
            </div>
            <div className="p-5 border rounded-2xl bg-card-dark glow-card border-white/5">
                <p className="mb-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">完成任务</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-accent-purple glow-purple">148</span>
                    <span className="ml-auto text-[10px] font-black text-primary">+18%</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsView;