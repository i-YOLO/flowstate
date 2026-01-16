import React, { useState, useEffect } from 'react';

interface FocusModeViewProps {
    onPause: () => void;
    onQuit: () => void;
    habitId?: string;
    categoryId?: string;
}

const FocusModeView: React.FC<FocusModeViewProps> = ({ onPause, onQuit, habitId, categoryId }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    const totalTime = 25 * 60;
    const startTimeStamp = React.useRef<Date>(new Date());
    const expectedEndTimeRef = React.useRef<number | null>(null);

    // Update real-world clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let interval: number;

        if (isActive && timeLeft > 0) {
            // Set the expected absolute end time when starting/resuming
            expectedEndTimeRef.current = Date.now() + timeLeft * 1000;

            interval = window.setInterval(() => {
                if (expectedEndTimeRef.current) {
                    const remaining = Math.max(0, Math.round((expectedEndTimeRef.current - Date.now()) / 1000));

                    if (remaining <= 0) {
                        setTimeLeft(0);
                        setIsActive(false);
                        handleFinish(true);
                    } else {
                        setTimeLeft(remaining);
                    }
                }
            }, 500); // Check more frequently (every 0.5s) but calculate based on timestamps
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]); // Only re-run when isActive changes

    const triggerToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleFinish = async (isAuto: boolean = false) => {
        if (isFinished) return;

        const durationMinutes = Math.floor((totalTime - timeLeft) / 60);

        if (durationMinutes < 1) {
            setIsActive(false);
            expectedEndTimeRef.current = null;
            triggerToast('专注时长不足 1 分钟，本次记录将不予保存。');
            // Reset timer with a slight delay for better UX
            setTimeout(() => setTimeLeft(totalTime), 500);
            return;
        }

        setIsActive(false);
        setIsSaving(true);
        const endTime = new Date();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/focus/sessions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startTime: startTimeStamp.current.toISOString(),
                    endTime: endTime.toISOString(),
                    duration: durationMinutes,
                    habitId: habitId || null,
                    categoryId: categoryId || null,
                    status: 'COMPLETED'
                })
            });

            if (response.ok) {
                setIsFinished(true);
                setTimeout(() => {
                    onQuit(); // Redirect back after success
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to save focus session:', err);
            triggerToast('保存失败，请检查网络连接');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTimer = () => {
        if (isActive) {
            expectedEndTimeRef.current = null;
            onPause();
        } else {
            // Update start time if first time starting
            if (timeLeft === totalTime) {
                startTimeStamp.current = new Date();
            }
        }
        setIsActive(!isActive);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    // SVG Circle calculation
    const circumference = 816;
    const progress = timeLeft / totalTime;
    const dashOffset = circumference * (1 - progress);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
            {/* Subtle Ambient Background Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20" style={{ background: 'radial-gradient(circle at 50% 40%, #00f2ff 0%, transparent 70%)' }}></div>

            {/* Custom Toast Notification */}
            <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out-expo ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <span className="material-symbols-outlined text-amber-400 text-xl">info</span>
                    <p className="text-sm font-bold text-white whitespace-nowrap">{toastMessage}</p>
                </div>
            </div>

            {/* Top Status Area */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-12">
                <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold tracking-widest uppercase">{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5">
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-slate-300 dark:bg-white/20'}`}></span>
                        <span className="text-[10px] font-bold tracking-widest uppercase">{isFinished ? '已完成' : (isActive ? '同步中' : '已暂停')}</span>
                    </div>
                </div>
            </div>

            {/* Central Focus Section */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
                {/* Circular Progress Timer */}
                <div className="relative flex items-center justify-center w-64 h-64 mb-12 shrink-0 transform translate-y-6">
                    {/* Static Background Circle */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 288 288">
                        <circle className="text-slate-200 dark:text-white/5" cx="144" cy="144" fill="transparent" r="130" stroke="currentColor" strokeWidth="8"></circle>
                        {/* Progress Foreground Circle */}
                        <circle
                            className={`text-primary transition-all duration-1000 ease-linear`}
                            cx="144" cy="144"
                            fill="transparent"
                            r="130"
                            stroke="currentColor"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            strokeWidth="8"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.4))' }}
                        ></circle>
                    </svg>

                    {/* Timer Content - Absolute positioning for perfect center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        {isFinished ? (
                            <div className="flex flex-col items-center animate-in zoom-in duration-500">
                                <span className="material-symbols-outlined text-primary text-6xl shadow-glow">check_circle</span>
                                <span className="text-sm font-bold mt-4 text-primary">太棒了！记录已存档</span>
                            </div>
                        ) : (
                            <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-white">
                                <div className="flex flex-col items-center w-[4.5rem]">
                                    <span className="text-5xl font-bold tracking-tighter leading-none font-sans">{minutes}</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-2 font-medium">分钟</span>
                                </div>
                                <span className="text-5xl font-bold tracking-tighter text-slate-300 dark:text-white/20 leading-none pb-4">:</span>
                                <div className="flex flex-col items-center w-[4.5rem]">
                                    <span className="text-5xl font-bold tracking-tighter leading-none font-sans">{seconds}</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-2 font-medium">秒</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Task Description */}
                <div className="text-center max-w-xs mx-auto">
                    <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">深度工作</h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className={`h-2 w-2 rounded-full bg-primary ${isActive ? 'animate-pulse' : ''}`}></span>
                        <p className="text-slate-500 dark:text-white/60 text-sm font-bold leading-normal tracking-wide">
                            {isFinished ? '整理成果中...' : (isActive ? '进行中' : '已暂停')} • 专注当下
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="relative z-10 flex flex-col items-center gap-6 pb-16 px-6">
                {!isFinished && (
                    <div className="flex gap-4 w-full max-w-[300px]">
                        <button
                            onClick={toggleTimer}
                            disabled={isSaving}
                            className={`flex flex-1 items-center justify-center gap-2 h-14 rounded-full font-bold text-lg transition-all active:scale-95 ${isActive ? 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white' : 'bg-primary text-slate-900 shadow-glow'}`}
                        >
                            <span className="material-symbols-outlined text-2xl">{isActive ? 'pause' : 'play_arrow'}</span>
                            <span>{isActive ? '暂停' : '开始'}</span>
                        </button>
                        {(timeLeft < totalTime || isActive) && (
                            <button
                                onClick={() => handleFinish(false)}
                                disabled={isSaving}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-green text-slate-900 shadow-glow animate-in slide-in-from-right-4 duration-300"
                            >
                                <span className="material-symbols-outlined text-2xl">{isSaving ? 'sync' : 'done_all'}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Ambient Particle/Blur Element */}
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute top-[10%] left-[-10%] w-48 h-48 rounded-full bg-primary/10 blur-[60px] pointer-events-none"></div>

            {/* Back Button (Absolute) */}
            {!isFinished && (
                <button onClick={onQuit} className="absolute top-6 left-6 z-20 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
            )}
        </div>
    );
};

export default FocusModeView;