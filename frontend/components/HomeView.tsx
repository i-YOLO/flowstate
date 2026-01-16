import React, { useEffect, useState } from 'react';

interface Habit {
    id: string;
    name: string;
    category: string;
    icon: string;
    goalValue: number;
    completedValue: number;
    unit: string;
    color: string;
}

interface HomeViewProps {
    onOpenNewEntry: () => void;
    onOpenCalendar: () => void;
    onAddHabit: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenNewEntry, onOpenCalendar, onAddHabit }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodayHabits();
    }, []);

    const fetchTodayHabits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/habits/today', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setHabits(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogHabit = async (habitId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/habits/${habitId}/log`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchTodayHabits();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const completionRate = habits.length > 0
        ? Math.round((habits.filter(h => h.completedValue >= h.goalValue).length / habits.length) * 100)
        : 0;

    const totalCompleted = habits.reduce((acc, h) => acc + h.completedValue, 0);
    const totalGoal = habits.reduce((acc, h) => acc + h.goalValue, 0);
    const overallProgress = totalGoal > 0 ? (totalCompleted / totalGoal) * 100 : 0;

    const colorMap: Record<string, string> = {
        indigo: 'accent-blue',
        amber: 'accent-amber',
        emerald: 'accent-green',
        rose: 'accent-pink',
        purple: 'accent-purple',
        sky: 'accent-cyan',
    };

    const hexMap: Record<string, string> = {
        indigo: '#6366f1',
        amber: '#f59e0b',
        emerald: '#10b981',
        rose: '#f43f5e',
        purple: '#a855f7',
        sky: '#22d3ee',
    };

    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日 星期${['日', '一', '二', '三', '四', '五', '六'][today.getDay()]}`;

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-background-dark no-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between p-4 pb-4 border-b bg-background-dark/80 backdrop-blur-xl border-white/5 shadow-sm shadow-black/20">
                <div className="flex items-center size-10 shrink-0"></div>
                <div className="flex-1 px-4 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{dateStr}</p>
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-white">每日习惯</h2>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        onClick={onAddHabit}
                        className="flex items-center justify-center text-white transition-all rounded-full cursor-pointer size-10 bg-primary shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] active:scale-90"
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
                            <p className="text-2xl font-bold text-white">{completionRate}%</p>
                            <p className="flex items-center text-xs font-bold text-accent-green">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> 实时
                            </p>
                        </div>
                        <div className="w-full mt-3 overflow-hidden rounded-full bg-slate-800 h-1.5">
                            <div className="h-full rounded-full bg-accent-green transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-1 p-4 border rounded-2xl bg-card-dark border-slate-700/50">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">今日习惯数</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-white">{habits.length}</p>
                            <p className="text-xs font-bold text-accent-cyan">个目标</p>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                            {habits.slice(0, 4).map((h, i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${h.completedValue >= h.goalValue ? 'bg-accent-cyan shadow-glow-cyan' : 'bg-slate-800'}`}></div>
                            ))}
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
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card-dark rounded-2xl animate-pulse"></div>)}
                        </div>
                    ) : habits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-2">list_alt</span>
                            <p className="text-sm font-medium">今天还没有习惯，点击右上角添加。</p>
                        </div>
                    ) : habits.map((h) => {
                        const isDone = h.completedValue >= h.goalValue;
                        const colorClass = colorMap[h.color] || 'accent-blue';
                        const hexColor = hexMap[h.color] || '#6366f1';
                        const progress = Math.min((h.completedValue / h.goalValue) * 100, 100);

                        return (
                            <div
                                key={h.id}
                                className={`flex flex-col gap-4 p-4 transition-all border shadow-lg rounded-2xl bg-card-dark border-slate-700/50 ${isDone ? 'opacity-70 grayscale-[0.3]' : 'active:scale-[0.98]'}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-${colorClass} text-[20px] ${isDone ? '' : 'fill-current'}`}>{h.icon}</span>
                                            <p className={`text-base font-bold text-white ${isDone ? 'line-through opacity-50' : ''}`}>{h.name}</p>
                                        </div>
                                        <p className="text-xs font-medium text-slate-400">目标: {h.goalValue}{h.unit} • {h.category}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex gap-1.5">
                                            {[1, 1, 1, 1, 0, 1, 1].map((s, i) => (
                                                <div key={i} className={`size-2 rounded-full ${s ? `bg-${colorClass} shadow-[0_0_8px_${hexColor}60]` : 'bg-slate-700'}`}></div>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">一 二 三 四 五 六 日</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="overflow-hidden rounded-full bg-slate-800 h-2.5 w-full">
                                            <div className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-accent-green' : `bg-${colorClass}`}`} style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="mt-2 text-[10px] font-medium text-slate-400">已完成 {h.completedValue} / {h.goalValue} {h.unit}</p>
                                    </div>
                                    {isDone ? (
                                        <div className="flex items-center justify-center text-slate-900 rounded-full size-10 bg-accent-green luminous-glow-green">
                                            <span className="font-bold material-symbols-outlined text-[24px]">check</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleLogHabit(h.id)}
                                            className={`flex min-w-[80px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-${colorClass}/10 text-${colorClass} border border-${colorClass}/20 gap-1 text-sm font-bold transition-all active:bg-${colorClass} active:text-slate-900`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                            <span>记录</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomeView;