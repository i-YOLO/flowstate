
import React, { useEffect, useState } from 'react';
import { apiFetch, API_BASE_URL } from '../utils/api';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

interface Habit {
    id: string;
    name: string;
    category: string;
    icon: string;
    goalValue: number;
    currentValue: number;
    unit: string;
    color: string;
    currentStreak: number;
    lastSevenDays: boolean[];
    frequency: Frequency;
}

interface HabitGroup {
    title: string;
    subtitle: string;
    habits: Habit[];
}

interface HomeViewProps {
    onOpenNewEntry: () => void;
    onOpenCalendar: () => void;
    onAddHabit: () => void;
}


interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

import DateSelectionModal from './DateSelectionModal';

const HomeView: React.FC<HomeViewProps> = ({ onOpenNewEntry, onOpenCalendar, onAddHabit }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggingId, setLoggingId] = useState<string | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [activeFrequency, setActiveFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchHabits();
    }, [selectedDate]);

    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const fetchHabits = async () => {
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const data = await apiFetch(API_BASE_URL + `/api/habits/today?date=${dateStr}`) as Habit[];
            if (data) {
                setHabits(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogHabit = async (habitId: string, increment: number = 1) => {
        if (loggingId) return;
        setLoggingId(habitId);
        try {
            const data = await apiFetch(API_BASE_URL + '/api/habits/' + habitId + '/log?increment=' + increment, {
                method: 'POST'
            });
            if (data) {
                const msg = increment > 0 ? '打卡成功！保持状态 ✨' : '已撤销一次打卡 ↩️';
                addToast(msg);
                fetchHabits();
            } else {
                addToast('记录失败，请重试', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('网络错误，请稍后重试', 'error');
        } finally {
            setLoggingId(null); // 立即恢复，允许连续打卡
        }
    };

    const completionRate = habits.length > 0
        ? Math.round((habits.filter(h => h.currentValue >= h.goalValue).length / habits.length) * 100)
        : 0;

    const totalCompleted = habits.reduce((acc, h) => acc + h.currentValue, 0);
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

    const dateStr = (selectedDate.getMonth() + 1) + '月' + selectedDate.getDate() + '日 星期' + ['日', '一', '二', '三', '四', '五', '六'][selectedDate.getDay()];
    
    // Calculate week range based on selectedDate
    const getWeekRange = () => {
        const d = new Date(selectedDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        const start = new Date(d.setDate(diff));
        const end = new Date(d.setDate(diff + 6));
        return {
            start: start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate(),
            end: end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
        };
    };

    const weekRange = getWeekRange();

    // Group habits by frequency
    const groupHabitsByFrequency = (): HabitGroup[] => {
        const dailyHabits = habits.filter(h => h.frequency === 'DAILY' || !h.frequency);
        const weeklyHabits = habits.filter(h => h.frequency === 'WEEKLY');
        const monthlyHabits = habits.filter(h => h.frequency === 'MONTHLY');

        const groups: HabitGroup[] = [];

        if (dailyHabits.length > 0) {
            groups.push({
                title: '本天目标',
                subtitle: selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0'),
                habits: dailyHabits
            });
        }

        if (weeklyHabits.length > 0) {
            groups.push({
                title: '本周目标',
                subtitle: weekRange.start + ' ~ ' + weekRange.end,
                habits: weeklyHabits
            });
        }

        if (monthlyHabits.length > 0) {
            groups.push({
                title: '本月目标',
                subtitle: selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0'),
                habits: monthlyHabits
            });
        }

        return groups;
    };

    const habitGroups = groupHabitsByFrequency();






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
                            <div className="h-full rounded-full bg-accent-green transition-all duration-500" style={{ width: overallProgress + '%' }}></div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-1 p-4 border rounded-2xl bg-card-dark border-slate-700/50">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">习惯总数</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-white">{habits.length}</p>
                            <p className="text-xs font-bold text-accent-cyan">个目标</p>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                                    {habits.slice(0, 4).map((h, i) => (
                                        <div key={i} className={'h-1.5 flex-1 rounded-full ' + (h.currentValue >= h.goalValue ? 'bg-accent-cyan shadow-glow-cyan' : 'bg-slate-800')}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
        
                        {/* Frequency Tabs - Modern Sliding Indicator Design */}
                        <div className="relative mx-4 mt-4 mb-2 bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                            {/* Sliding Indicator */}
                            <div 
                                className="absolute top-1 bottom-1 transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan shadow-lg"
                                style={{
                                    width: 'calc(33.333% - 0.5rem)',
                                    left: activeFrequency === 'DAILY' ? '0.25rem' : activeFrequency === 'WEEKLY' ? 'calc(33.333% + 0.083rem)' : 'calc(66.666% - 0.083rem)',
                                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                                }}
                            />
                            
                            {/* Tab Buttons */}
                            <div className="relative flex">
                                <button
                                    onClick={() => setActiveFrequency('DAILY')}
                                    className={
                                        'flex-1 px-4 py-3 text-sm font-bold transition-colors duration-300 rounded-xl z-10 ' +
                                        (activeFrequency === 'DAILY'
                                            ? 'text-slate-900'
                                            : 'text-slate-400 hover:text-white')
                                    }
                                >
                                    日目标
                                </button>
                                <button
                                    onClick={() => setActiveFrequency('WEEKLY')}
                                    className={
                                        'flex-1 px-4 py-3 text-sm font-bold transition-colors duration-300 rounded-xl z-10 ' +
                                        (activeFrequency === 'WEEKLY'
                                            ? 'text-slate-900'
                                            : 'text-slate-400 hover:text-white')
                                    }
                                >
                                    周目标
                                </button>
                                <button
                                    onClick={() => setActiveFrequency('MONTHLY')}
                                    className={
                                        'flex-1 px-4 py-3 text-sm font-bold transition-colors duration-300 rounded-xl z-10 ' +
                                        (activeFrequency === 'MONTHLY'
                                            ? 'text-slate-900'
                                            : 'text-slate-400 hover:text-white')
                                    }
                                >
                                    月目标
                                </button>
                            </div>
                        </div>
        
                        {/* Habit Groups */}
                        {loading ? (
                            <div className="flex flex-col gap-3 p-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card-dark rounded-2xl animate-pulse"></div>)}
                            </div>
                        ) : habits.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 px-4">
                                <span className="material-symbols-outlined text-4xl mb-2">list_alt</span>
                                <p className="text-sm font-medium">今天还没有习惯，点击右上角添加。</p>
                            </div>
                        ) : (
                            habitGroups.filter(group => {
                                // 根据 activeFrequency 过滤对应的分组
                                if (activeFrequency === 'DAILY' && group.title === '本天目标') return true;
                                if (activeFrequency === 'WEEKLY' && group.title === '本周目标') return true;
                                if (activeFrequency === 'MONTHLY' && group.title === '本月目标') return true;
                                return false;
                            }).map((group, groupIndex) => (
                                <div key={groupIndex} className="mb-6">
                                    {/* Premium Date Header */}
                                    <div className="flex items-end justify-between px-4 pt-6 pb-4">
                                        <div className="flex items-end gap-3">
                                            {activeFrequency === 'DAILY' && (
                                                <>
                                                    <span className="text-4xl font-black text-white leading-none tracking-tight">
                                                        {selectedDate.getDate()}
                                                    </span>
                                                    <div className="flex flex-col pb-0.5">
                                                        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider leading-none mb-1">
                                                            {selectedDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-400 leading-none">
                                                            {selectedDate.getFullYear()} · 星期{['日', '一', '二', '三', '四', '五', '六'][selectedDate.getDay()]}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                            {activeFrequency === 'WEEKLY' && (() => {
                                                const currentDay = selectedDate.getDay() || 7;
                                                const startOfWeek = new Date(selectedDate);
                                                startOfWeek.setDate(selectedDate.getDate() - currentDay + 1);
                                                const endOfWeek = new Date(selectedDate);
                                                endOfWeek.setDate(selectedDate.getDate() - currentDay + 7);
                                                
                                                return (
                                                    <>
                                                        <span className="text-4xl font-black text-white leading-none tracking-tight">
                                                            {startOfWeek.getDate()}<span className="text-2xl text-slate-500 mx-1">-</span>{endOfWeek.getDate()}
                                                        </span>
                                                        <div className="flex flex-col pb-0.5">
                                                            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider leading-none mb-1">
                                                                {startOfWeek.toLocaleString('default', { month: 'short' }).toUpperCase()}
                                                            </span>
                                                            <span className="text-xs font-medium text-slate-400 leading-none">
                                                                Week {Math.ceil((selectedDate.getDate() + 6 - selectedDate.getDay()) / 7)}
                                                            </span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                            {activeFrequency === 'MONTHLY' && (
                                                <>
                                                    <span className="text-4xl font-black text-white leading-none tracking-tight">
                                                        {String(selectedDate.getMonth() + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className="flex flex-col pb-0.5">
                                                        <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider leading-none mb-1">
                                                            {selectedDate.getFullYear()}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-400 leading-none uppercase">
                                                            {selectedDate.toLocaleString('default', { month: 'long' })}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const today = new Date();
                                                let showBack = false;
                                                let backText = '回到今天';
                                                
                                                if (activeFrequency === 'DAILY') {
                                                    if (selectedDate.toDateString() !== today.toDateString()) {
                                                        showBack = true;
                                                        backText = '回到今天';
                                                    }
                                                } else if (activeFrequency === 'WEEKLY') {
                                                    const getWeekStart = (d: Date) => {
                                                        const date = new Date(d);
                                                        const day = date.getDay() || 7;
                                                        date.setDate(date.getDate() - day + 1);
                                                        return date.toDateString();
                                                    };
                                                    if (getWeekStart(selectedDate) !== getWeekStart(today)) {
                                                        showBack = true;
                                                        backText = '回到本周';
                                                    }
                                                } else if (activeFrequency === 'MONTHLY') {
                                                     if (selectedDate.getMonth() !== today.getMonth() || selectedDate.getFullYear() !== today.getFullYear()) {
                                                        showBack = true;
                                                        backText = '回到本月';
                                                     }
                                                }

                                                return showBack ? (
                                                    <button 
                                                        onClick={() => setSelectedDate(new Date())}
                                                        className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors active:scale-95"
                                                    >
                                                        {backText}
                                                    </button>
                                                ) : null;
                                            })()}

                                            <button 
                                                onClick={() => setShowDateModal(true)} 
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 active:scale-95 group"
                                            >
                                                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">日历</span>
                                                <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-white transition-colors">calendar_month</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Habits List */}
                                    <div className="flex flex-col gap-3 px-4 pb-2">
                                        {group.habits.map((h) => {
                                            const isDone = h.currentValue >= h.goalValue;
                                            const progress = Math.min((h.currentValue / h.goalValue) * 100, 100);
                                            const colorClass = colorMap[h.color] || 'accent-blue';
                                            const hexColor = hexMap[h.color] || '#6366f1';
                                            
                                            // Dynamic Style Logic
                                            const isApproaching = !isDone && progress >= 80;
                                            const barColor = isDone ? '#4ade80' : (isApproaching ? '#f59e0b' : hexColor);
                                            const barShadow = isDone 
                                                ? '0 0 15px rgba(74, 222, 128, 0.6)' 
                                                : (isApproaching ? '0 0 20px rgba(245, 158, 11, 0.6)' : `0 0 12px ${hexColor}60`);
                                            const barTexture = isApproaching 
                                                ? 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)' // Faster/Tighter stripes for urgency
                                                : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 8px)'; // Standard texture

                                            return (
                                                <div
                                                    key={h.id}
                                                    className={'flex flex-col gap-4 p-4 transition-all border shadow-lg rounded-2xl bg-card-dark border-slate-700/50 ' + (isDone ? 'opacity-70 grayscale-[0.3]' : 'active:scale-[0.98]')}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={'material-symbols-outlined text-' + colorClass + ' text-[20px] ' + (isDone ? '' : 'fill-current')}>{h.icon}</span>
                                                                <p className={'text-base font-bold text-white ' + (isDone ? 'line-through opacity-50' : '')}>{h.name}</p>
                                                                {h.currentStreak > 0 && (
                                                                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                                                        <span className="material-symbols-outlined text-[14px] filled">local_fire_department</span>
                                                                        <span className="text-[10px] font-black">{h.currentStreak}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs font-medium text-slate-400">目标: {h.goalValue}{h.unit} • {h.category}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex gap-1.5">
                                                                {(h.lastSevenDays || [false, false, false, false, false, false, false]).map((s, i) => (
                                                                    <div key={i} className={'size-2 rounded-full ' + (s ? 'bg-' + colorClass + ' shadow-[0_0_8px_' + hexColor + '60]' : 'bg-slate-700')}></div>
                                                                ))}
                                                            </div>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-right">
                                                                最近 7 天打卡
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="relative h-3.5 w-full bg-black/40 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden">
                                                                <div 
                                                                    className="h-full rounded-full relative transition-all duration-700 ease-out" 
                                                                    style={{ 
                                                                        width: progress + '%', 
                                                                        backgroundColor: barColor,
                                                                        boxShadow: barShadow
                                                                    }}
                                                                >
                                                                    <div className="absolute inset-0 w-full h-full opacity-30" style={{ backgroundImage: barTexture }}></div>
                                                                    <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent"></div>
                                                                    {isApproaching && (
                                                                        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="mt-2 text-[10px] font-medium text-slate-400">已完成 {h.currentValue} / {h.goalValue} {h.unit}</p>
                                                        </div>
                                                        {isDone ? (
                                                            <button
                                                                onClick={() => handleLogHabit(h.id, -1)}
                                                                disabled={loggingId === h.id}
                                                                className="flex items-center justify-center text-slate-900 rounded-full size-10 bg-accent-green luminous-glow-green hover:bg-red-500 hover:text-white transition-all duration-300"
                                                                title="点击撤销"
                                                            >
                                                                {loggingId === h.id ? (
                                                                    <span className="material-symbols-outlined text-[24px] animate-spin">sync</span>
                                                                ) : (
                                                                    <span className="font-bold material-symbols-outlined text-[24px]">check</span>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleLogHabit(h.id, 1)}
                                                                disabled={loggingId === h.id}
                                                                className={
                                                                    'flex min-w-[100px] items-center justify-center rounded-xl h-10 px-4 transition-all duration-300 gap-1 text-sm font-bold border ' +
                                                                    (loggingId === h.id 
                                                                        ? 'cursor-wait' 
                                                                        : 'cursor-pointer hover:scale-[1.02] active:scale-95')
                                                                }
                                                                style={{
                                                                    backgroundColor: hexColor + '1A',
                                                                    color: hexColor,
                                                                    borderColor: hexColor + '33'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (loggingId !== h.id) {
                                                                        e.currentTarget.style.backgroundColor = hexColor;
                                                                        e.currentTarget.style.color = '#0f172a';
                                                                        e.currentTarget.style.boxShadow = `0 0 20px ${hexColor}40`;
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (loggingId !== h.id) {
                                                                        e.currentTarget.style.backgroundColor = hexColor + '1A';
                                                                        e.currentTarget.style.color = hexColor;
                                                                        e.currentTarget.style.boxShadow = 'none';
                                                                    }
                                                                }}
                                                            >
                                                                {loggingId === h.id ? (
                                                                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                                )}
                                                                <span className="font-semibold">记录</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}


                {/* Toast Notification Container */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[320px] px-4">
                    {toasts.map(toast => (
                        <div 
                            key={toast.id}
                            className={'flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md animate-slide-up ' +
                                (toast.type === 'success' 
                                    ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-500')}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {toast.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            <span className="text-sm font-bold leading-none">{toast.message}</span>
                        </div>
                    ))}
                </div>

                <DateSelectionModal 
                    isOpen={showDateModal}
                    onClose={() => setShowDateModal(false)}
                    activeFrequency={activeFrequency}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />
            </div>
        </div>
    );
};

export default HomeView;