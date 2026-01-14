import React, { useState } from 'react';

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

  const handleCreateHabit = async () => {
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          icon: selectedIcon,
          // Map color class to backend expected value
          color: mapColorToBackend(selectedColor),
          category: '通用',
          goalValue: 1,
          unit: '次'
        })
      });

      if (response.ok) {
        onSave();
      } else {
        console.error('Failed to create habit');
      }
    } catch (err) {
      console.error(err);
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
        {/* TopAppBar */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between">
            <button onClick={onCancel} className="text-primary text-base font-medium">取消</button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">新建习惯</h2>
            <div className="w-12"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* TextField: Habit Name */}
          <div className="flex flex-col gap-2 px-4 py-6">
            <label className="flex flex-col w-full">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider pb-2">习惯名称</p>
              <input
                className="flex w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-white dark:bg-[#192233] h-14 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-4 text-lg font-medium shadow-sm"
                placeholder="例如：喝水"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>

          {/* SectionHeader: Choose Icon */}
          <div className="px-4 pt-2">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">图标 & 样式</h3>
          </div>

          {/* Icon Library */}
          <div className="grid grid-cols-4 gap-3 p-4">
            {icons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-200 ${selectedIcon === icon
                  ? 'border-2 border-primary bg-primary/10'
                  : 'border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] hover:bg-slate-50 dark:hover:bg-[#202b40]'
                  }`}
              >
                <span className={`material-symbols-outlined text-3xl ${selectedIcon === icon ? 'text-primary' : 'text-slate-600 dark:text-white'
                  }`}>
                  {icon}
                </span>
              </button>
            ))}
          </div>

          {/* Color Picker - Shifted layout as requested */}
          <div className="px-4 py-2">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider pb-3">主题颜色</p>
            {/* Added pl-2 pt-2 to shift items slightly down-right */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1 pl-3 pt-2">
              {colors.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedColor(bg)}
                  className={`size-10 rounded-full ${bg} shrink-0 transition-all duration-200 ${selectedColor === bg
                    ? 'ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-primary scale-110'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                ></button>
              ))}
            </div>
          </div>

          {/* SectionHeader: Frequency */}
          <div className="px-4 pt-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">时间安排</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* Segmented Control for Frequency */}
            <div className="flex p-1 bg-slate-200 dark:bg-[#192233] rounded-xl">
              {['每天', '每周', '自定义'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${frequency === f
                    ? 'bg-white dark:bg-[#324467] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Days of week - Interactive and starting with Sunday */}
            <div className="flex justify-between gap-1">
              {days.map((d, i) => {
                const isSelected = selectedDays.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`size-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                      : 'border border-slate-300 dark:border-[#324467] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202b40]'
                      }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Section */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between bg-white dark:bg-[#192233] p-4 rounded-xl border border-slate-200 dark:border-[#324467]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${reminderEnabled ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <span className={`material-symbols-outlined ${reminderEnabled ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>notifications_active</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">提醒</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">设置每日提醒</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-bold transition-opacity ${reminderEnabled ? 'text-primary opacity-100' : 'text-slate-400 opacity-50'}`}>上午 08:00</span>

                {/* Reminder Toggle */}
                <div
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${reminderEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${reminderEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Toggle */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between bg-white dark:bg-[#192233] p-4 rounded-xl border border-slate-200 dark:border-[#324467]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${socialEnabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <span className={`material-symbols-outlined ${socialEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>group</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">社交追踪</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">朋友可以看到你的进度</p>
                </div>
              </div>

              {/* Social Toggle Switch */}
              <div
                onClick={() => setSocialEnabled(!socialEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${socialEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${socialEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          </div>
          <div className="h-10"></div>
        </main>

        {/* Fixed Footer Action */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
          <button onClick={handleCreateHabit} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
            创建习惯
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddHabitView;