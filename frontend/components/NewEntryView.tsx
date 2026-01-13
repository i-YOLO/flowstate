import React, { useState } from 'react';

interface NewEntryViewProps {
  onClose: () => void;
  onStartFocusMode: () => void;
  onLogTime: () => void;
}

const NewEntryView: React.FC<NewEntryViewProps> = ({ onClose, onStartFocusMode, onLogTime }) => {
  const [selectedCategory, setSelectedCategory] = useState('工作');

  const categories = [
    { name: '工作', icon: 'work' },
    { name: '学习', icon: 'menu_book' },
    { name: '运动', icon: 'fitness_center' },
    { name: '健康', icon: 'favorite' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* AppBar */}
      <div className="flex items-center justify-between p-4">
        <button onClick={onClose} className="flex items-center justify-center size-12 text-slate-800 dark:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-bold text-center text-slate-900 dark:text-white">新记录</h2>
        <div className="w-12 flex justify-end">
            <span className="material-symbols-outlined text-slate-800 dark:text-white">more_horiz</span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center py-10">
        <div className="flex gap-2 items-center justify-center w-full px-4">
             {/* Hour */}
             <div className="flex flex-col gap-2 w-20">
                <div className="h-20 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/5">
                    <span className="text-3xl font-light text-slate-900 dark:text-white">00</span>
                </div>
                <p className="text-xs font-medium text-center uppercase text-slate-500">小时</p>
             </div>
             <span className="text-3xl text-slate-400 pb-6">:</span>
             {/* Min */}
             <div className="flex flex-col gap-2 w-20">
                <div className="h-20 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/5">
                    <span className="text-3xl font-light text-slate-900 dark:text-white">25</span>
                </div>
                <p className="text-xs font-medium text-center uppercase text-slate-500">分钟</p>
             </div>
             <span className="text-3xl text-slate-400 pb-6">:</span>
             {/* Sec */}
             <div className="flex flex-col gap-2 w-20">
                <div className="h-20 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-white/5">
                    <span className="text-3xl font-light text-slate-900 dark:text-white">00</span>
                </div>
                <p className="text-xs font-medium text-center uppercase text-slate-500">秒</p>
             </div>
        </div>

        <div className="flex gap-4 mt-8">
            <button 
                onClick={onStartFocusMode}
                className="flex items-center gap-2 px-8 py-3 font-bold text-white rounded-full bg-primary shadow-glow active:scale-95 transition-transform"
            >
                <span className="material-symbols-outlined">play_arrow</span> 开始计时
            </button>
            <button 
                onClick={onLogTime}
                className="px-8 py-3 font-bold text-slate-800 dark:text-white bg-slate-200 dark:bg-slate-800 rounded-full active:scale-95 transition-transform"
            >
                记录时长
            </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">分类</h3>
        <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => {
                const isActive = selectedCategory === cat.name;
                return (
                    <button 
                        key={cat.name} 
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            isActive 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-slate-500'}`}>{cat.icon}</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Notes */}
      <div className="px-4 mt-6">
         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">备注</h3>
         <textarea 
            className="w-full h-32 p-4 text-base rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="你在做什么？"
         ></textarea>
      </div>

      {/* Tags */}
      <div className="px-4 mt-4 pb-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">标签</h3>
        <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium">#深度工作</span>
            <span className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">#设计</span>
            <span className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">#会议</span>
            <button className="flex items-center justify-center size-8 rounded-full border border-dashed border-slate-400 text-slate-500">
                <span className="material-symbols-outlined text-sm">add</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewEntryView;