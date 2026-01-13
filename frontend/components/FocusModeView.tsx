import React, { useState, useEffect } from 'react';

interface FocusModeViewProps {
  onPause: () => void;
  onQuit: () => void;
}

const FocusModeView: React.FC<FocusModeViewProps> = ({ onPause, onQuit }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const totalTime = 25 * 60;

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleTimer = () => {
    if (isActive) {
        onPause();
    }
    setIsActive(!isActive);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // SVG Circle calculation
  // Radius = 130
  // Circumference = 2 * PI * 130 ≈ 816.8
  const circumference = 816;
  const progress = timeLeft / totalTime;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20" style={{background: 'radial-gradient(circle at 50% 40%, #00f2ff 0%, transparent 70%)'}}></div>
        
        {/* Top Status Area */}
        <div className="relative z-10 flex items-center justify-between p-6 pt-12">
            <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                <span className="material-symbols-outlined text-sm">notifications_off</span>
                <span className="text-xs font-medium tracking-widest uppercase">请勿打扰</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                <span className="material-symbols-outlined text-sm">battery_charging_full</span>
                <span className="text-xs font-medium tracking-widest uppercase">活跃中</span>
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
                </div>
            </div>

            {/* Task Description */}
            <div className="text-center max-w-xs mx-auto">
                <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">深度工作 - 项目 X</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className={`h-2 w-2 rounded-full bg-primary ${isActive ? 'animate-pulse' : ''}`}></span>
                    <p className="text-slate-500 dark:text-white/60 text-sm font-bold leading-normal tracking-wide">
                        {isActive ? '进行中' : '已暂停'} • 第 2 节 / 共 4 节
                    </p>
                </div>
            </div>
        </div>

        {/* Progress Summary */}
        <div className="relative z-10 px-8 mb-8 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <p className="text-slate-400 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">总进度</p>
                    <p className="text-slate-600 dark:text-white/60 text-xs font-bold">75% 完成</p>
                </div>
                <div className="rounded-full h-1.5 bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]" style={{width: '75%'}}></div>
                </div>
            </div>
        </div>

        {/* Controls Section */}
        <div className="relative z-10 flex flex-col items-center gap-6 pb-16 px-6">
            <button 
                onClick={toggleTimer} 
                className="flex items-center justify-center gap-2 w-full max-w-[200px] h-14 rounded-full font-bold text-lg shadow-[0_0_20px_-5px_rgba(0,242,255,0.4)] transition-all active:scale-95 bg-primary text-slate-900 hover:bg-primary/90"
            >
                <span className="material-symbols-outlined text-2xl">{isActive ? 'pause' : 'play_arrow'}</span>
                <span>{isActive ? '暂停' : '开始'}</span>
            </button>
        </div>

        {/* Ambient Particle/Blur Element */}
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute top-[10%] left-[-10%] w-48 h-48 rounded-full bg-primary/10 blur-[60px] pointer-events-none"></div>
        
        {/* Back Button (Absolute) */}
        <button onClick={onQuit} className="absolute top-6 left-6 z-20 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
    </div>
  );
};

export default FocusModeView;