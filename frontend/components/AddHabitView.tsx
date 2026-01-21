import React, { useState } from 'react';
import { apiFetch, API_BASE_URL } from '../utils/api';

interface AddHabitViewProps {
  onCancel: () => void;
  onSave: () => void;
}

const AddHabitView: React.FC<AddHabitViewProps> = ({ onCancel, onSave }) => {
  const icons = ['water_drop', 'fitness_center', 'self_improvement', 'menu_book', 'bedtime', 'timer', 'psychology', 'more_horiz'];
  const colors = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500'];
  // Reordered days to start with Sunday
  const days = ['日', '一', '二', '三', '四', '五', '六'];

  const [selectedIcon, setSelectedIcon] = useState('water_drop');
  const [selectedColor, setSelectedColor] = useState('bg-primary');
  const [name, setName] = useState('');
  const [goalValue, setGoalValue] = useState<number>(1);
  const [unit, setUnit] = useState('次');

  // Frequency State
  const [frequency, setFrequency] = useState('每天');

  // Days State
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default Mon-Fri selected (indices 1-5)

  // Toggles State
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [socialEnabled, setSocialEnabled] = useState(false);

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const handleCreateHabit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || loading) return;

    setLoading(true);
    try {
      // Map Chinese frequency to English enum
      const frequencyMap: Record<string, string> = {
        '每天': 'DAILY',
        '每周': 'WEEKLY',
        '每月': 'MONTHLY'
      };

      await apiFetch(`${API_BASE_URL}/api/habits`, {
        method: 'POST',
        body: {
          name: trimmedName,
          icon: selectedIcon,
          color: mapColorToBackend(selectedColor),
          category: '通用',
          frequency: frequencyMap[frequency] || 'DAILY',
          goalValue: goalValue,
          unit: unit
        }
      });
      // 如果没有抛出错误，说明成功了
      onSave();
    } catch (err: any) {
      console.error(err);
      setErrorModal({ show: true, message: err.message || '网络请求失败，请检查连接' });
    } finally {
      setLoading(false);
    }
  };

  const mapColorToBackend = (bgClass: string) => {
    if (bgClass.includes('primary')) return 'indigo'; // Assuming primary ~ indigo/blue
    if (bgClass.includes('emerald')) return 'emerald';
    if (bgClass.includes('amber')) return 'amber';
    if (bgClass.includes('rose')) return 'rose';
    if (bgClass.includes('purple')) return 'purple';
    if (bgClass.includes('indigo')) return 'indigo';
    if (bgClass.includes('orange')) return 'amber'; // fallback
    return 'indigo';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display flex flex-col">
      <div className="max-w-[480px] w-full mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
        {/* Neo-Glassmorphism Header */}
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl">
          <div className="flex items-center p-4 justify-between">
            <button onClick={onCancel} className="text-slate-400 text-base font-medium hover:text-white transition-colors">取消</button>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">创建新习惯</h2>
            <div className="w-12"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-black no-scrollbar flex flex-col pt-2">
          {/* 3D Floating Icon Preview - Balanced */}
          <div className="flex flex-col items-center py-6">
            <div className="relative size-28 flex items-center justify-center animate-pulse-scale">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 blur-xl"></div>
              <div className="relative size-24 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center neon-border-cyan">
                <span className="material-symbols-outlined text-4xl text-white glow-cyan">{selectedIcon}</span>
              </div>
            </div>
          </div>

          {/* Habit Name Input */}
          <div className="px-8 pb-6">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] pb-1.5 opacity-80">习惯名称</p>
            <input
              className="w-full rounded-2xl text-white focus:outline-0 focus:ring-2 focus:ring-cyan-500/50 border border-white/10 bg-[#111118] h-14 placeholder:text-slate-700 px-6 text-base font-medium shadow-inner"
              placeholder="例如：阅读一本书"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 3D Icon Selector - Elegant Scaling */}
          <div className="px-0 pb-6 relative overflow-hidden">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-3 px-8">
              {icons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`shrink-0 size-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${selectedIcon === icon
                    ? 'bg-gradient-to-br from-cyan-500/10 to-purple-600/10 neon-border-cyan scale-105'
                    : 'bg-[#111118] border border-white/5 hover:border-white/20'
                    }`}
                >
                  <span className={`material-symbols-outlined text-2xl transition-all ${selectedIcon === icon ? 'text-cyan-400 glow-cyan' : 'text-slate-500'}`}>
                    {icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Section - Balanced */}
          <div className="px-8 pt-4 pb-8">
            <h2 className="text-white text-base font-bold mb-4">频率设置</h2>
            <div className="flex p-1.5 bg-[#111118] rounded-full border border-white/5">
              {['每天', '每周', '每月'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-full transition-all duration-300 ${frequency === f
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Target Section - Balanced */}
          <div className="px-8 pb-10 text-center">
            <h2 className="text-white text-base font-bold mb-5">习惯目标</h2>
            <div className="flex items-center justify-center gap-10">
              <button 
                onClick={() => setGoalValue(Math.max(1, goalValue - 1))}
                className="size-12 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all active:scale-95 shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <div className="text-5xl font-black neon-glow-text-purple min-w-[80px] tracking-tight">
                {goalValue}
              </div>
              <button 
                onClick={() => setGoalValue(goalValue + 1)}
                className="size-12 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 transition-all active:scale-95 shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <p className="text-slate-500 text-sm font-medium">{goalValue}</p>
              <input 
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-transparent border-b border-white/10 text-white text-sm font-bold w-10 text-center focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="次"
              />
              <p className="text-slate-500 text-sm font-medium">/ {frequency}</p>
            </div>
          </div>

          {/* Create Button - Now in document flow */}
          <div className="px-8 pb-8">
            <button 
              onClick={handleCreateHabit} 
              disabled={loading}
              className={`w-full font-bold py-4 rounded-full text-base transition-all ${loading ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'neon-btn-gradient text-white active:scale-[0.98]'}`}
            >
              {loading ? '正在创建...' : '创建新习惯'}
            </button>
          </div>
        </main>
      </div>

      {/* Custom Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-[320px] bg-[#1C2333] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out-expo">
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
                 </div>
                 <h3 className="text-white text-xl font-bold mb-2">出错了</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {errorModal.message}
                 </p>
                 <button 
                   onClick={() => setErrorModal({ show: false, message: '' })}
                   className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all active:scale-95 border border-white/5"
                 >
                    知道了
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AddHabitView;