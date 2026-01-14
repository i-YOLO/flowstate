import React, { useState, useMemo, useEffect, useRef } from 'react';

export interface TimeRecordData {
  id?: string;
  title?: string;
  startTime: string; // HH:MM (24h)
  endTime: string;   // HH:MM (24h)
  category?: string;
  notes?: string;
}

interface AddTimeRecordViewProps {
  onCancel: () => void;
  onSave: () => void;
  initialData?: TimeRecordData | null;
}

// Helper to convert 24h time to 12h object
const parseTime = (time: string) => {
  if (!time) return { h: '12', m: '00', period: 'AM' };
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return {
    h: String(hour12).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    period
  };
};

// Helper to convert 12h parts back to 24h string
const stringifyTime = (h12: string, m: string, period: string) => {
  let h = parseInt(h12, 10);
  const min = parseInt(m, 10);

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

const ScrollPicker = ({
  items,
  value,
  onChange
}: {
  items: string[],
  value: string,
  onChange: (val: string) => void
}) => {
  const itemHeight = 40; // Ultra-compact height
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const timeoutRef = useRef<any>(null);

  // Sync scroll position with value prop
  useEffect(() => {
    if (containerRef.current && !isScrolling.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolling.current = true;
    clearTimeout(timeoutRef.current);

    const target = e.currentTarget;

    // Debounce the selection update to avoid jitter during rapid scrolling
    timeoutRef.current = setTimeout(() => {
      const scrollTop = target.scrollTop;
      const index = Math.round(scrollTop / itemHeight);

      if (index >= 0 && index < items.length) {
        const newValue = items[index];
        if (newValue !== value) {
          onChange(newValue);
        }
      }
      isScrolling.current = false;
    }, 100);
  };

  const handleClick = (item: string) => {
    onChange(item);
    if (containerRef.current) {
      const index = items.indexOf(item);
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative h-[120px] flex-1">
      {/* 120px = 3 visible items * 40px height */}

      {/* Active Highlight Background */}
      <div className="absolute top-[40px] left-0 right-0 h-[40px] bg-slate-100 dark:bg-slate-800 rounded-lg pointer-events-none z-0 border border-slate-200 dark:border-white/5"></div>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto snap-y snap-mandatory no-scrollbar z-10 py-[40px]"
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div
            key={item}
            onClick={() => handleClick(item)}
            className={`h-[40px] flex items-center justify-center snap-center font-bold transition-all duration-200 cursor-pointer select-none ${item === value
              ? 'text-xl text-slate-900 dark:text-white scale-110'
              : 'text-base text-slate-400 dark:text-slate-600'
              }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const EditTimeOverlay = ({
  initialStartTime,
  initialEndTime,
  onCancel,
  onUpdate
}: {
  initialStartTime: string,
  initialEndTime: string,
  onCancel: () => void,
  onUpdate: (start: string, end: string) => void
}) => {
  const [start, setStart] = useState(parseTime(initialStartTime));
  const [end, setEnd] = useState(parseTime(initialEndTime));

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const updateStartHour = (v: string) => setStart(p => ({ ...p, h: v }));
  const updateStartMin = (v: string) => setStart(p => ({ ...p, m: v }));
  const updateStartPeriod = (v: string) => setStart(p => ({ ...p, period: v }));

  const updateEndHour = (v: string) => setEnd(p => ({ ...p, h: v }));
  const updateEndMin = (v: string) => setEnd(p => ({ ...p, m: v }));
  const updateEndPeriod = (v: string) => setEnd(p => ({ ...p, period: v }));

  const durationDisplay = useMemo(() => {
    const startH = parseInt(start.h);
    const startM = parseInt(start.m);
    const endH = parseInt(end.h);
    const endM = parseInt(end.m);

    const startTotal = (start.period === 'PM' && startH !== 12 ? startH + 12 : (start.period === 'AM' && startH === 12 ? 0 : startH)) * 60 + startM;
    const endTotal = (end.period === 'PM' && endH !== 12 ? endH + 12 : (end.period === 'AM' && endH === 12 ? 0 : endH)) * 60 + endM;

    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24 * 60;

    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return { display: `${h}小时 ${m}分钟`, isNextDay: endTotal < startTotal };
  }, [start, end]);

  const handleSave = () => {
    onUpdate(stringifyTime(start.h, start.m, start.period), stringifyTime(end.h, end.m, end.period));
  };

  const addMinutes = (addMins: number) => {
    const currentEndH = parseInt(end.h);
    const currentEndM = parseInt(end.m);

    const currentEndTotal = (end.period === 'PM' && currentEndH !== 12 ? currentEndH + 12 : (end.period === 'AM' && currentEndH === 12 ? 0 : currentEndH)) * 60 + currentEndM;
    let newTotal = currentEndTotal + addMins;

    // Wrap around 24h
    if (newTotal >= 24 * 60) newTotal -= 24 * 60;

    const newH24 = Math.floor(newTotal / 60);
    const newM = newTotal % 60;
    const newPeriod = newH24 >= 12 ? 'PM' : 'AM';
    const newH12 = newH24 % 12 || 12;

    setEnd({
      h: String(newH12).padStart(2, '0'),
      m: String(newM).padStart(2, '0'),
      period: newPeriod
    });
  };

  const reset = () => {
    setEnd(parseTime(initialEndTime));
    setStart(parseTime(initialStartTime));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background-light dark:bg-background-dark animate-in fade-in slide-in-from-bottom-4 duration-200 h-full overflow-hidden max-w-md mx-auto">
      <header className="flex items-center p-3 sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md shrink-0">
        <div className="flex size-10 shrink-0 items-center justify-start">
          <button onClick={onCancel} className="flex items-center justify-center size-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-xl text-slate-900 dark:text-white">close</span>
          </button>
        </div>
        <h2 className="text-base font-bold leading-tight tracking-tight flex-1 text-center text-slate-900 dark:text-white">编辑时间</h2>
        <div className="flex w-10 items-center justify-end">
          <button onClick={onCancel} className="text-primary text-sm font-semibold shrink-0">取消</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto">
        {/* Start Time Card */}
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 shadow-glow-card border border-slate-200 dark:border-slate-800 relative z-0 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-green-500/10 p-1.5 rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-base filled">play_circle</span>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">开始时间</h3>
            </div>
            {/* Duration Badge */}
            <div className="bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              <span className="text-primary font-bold text-[10px] tracking-tight">{durationDisplay.display}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 w-full">
            <ScrollPicker items={hours} value={start.h} onChange={updateStartHour} />
            <div className="text-slate-300 dark:text-slate-700 font-bold text-lg pb-1">:</div>
            <ScrollPicker items={minutes} value={start.m} onChange={updateStartMin} />
            <div className="w-1"></div>
            <ScrollPicker items={periods} value={start.period} onChange={updateStartPeriod} />
          </div>
        </div>

        {/* End Time Card */}
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 shadow-glow-card border border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-red-500/10 p-1.5 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-base filled">stop_circle</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              结束时间
              {durationDisplay.isNextDay && <span className="ml-2 text-red-500 bg-red-500/10 px-1 rounded text-[10px]">+1 天</span>}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-1 w-full">
            <ScrollPicker items={hours} value={end.h} onChange={updateEndHour} />
            <div className="text-slate-300 dark:text-slate-700 font-bold text-lg pb-1">:</div>
            <ScrollPicker items={minutes} value={end.m} onChange={updateEndMin} />
            <div className="w-1"></div>
            <ScrollPicker items={periods} value={end.period} onChange={updateEndPeriod} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-2 mt-1 shrink-0">
          <button onClick={() => addMinutes(15)} className="px-3 py-1.5 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm">+15m</button>
          <button onClick={() => addMinutes(30)} className="px-3 py-1.5 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm">+30m</button>
          <button onClick={() => addMinutes(60)} className="px-3 py-1.5 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm">+1h</button>
          <button onClick={reset} className="px-3 py-1.5 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-red-500 text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-95 shadow-sm">重置</button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl max-w-md mx-auto z-20">
        <button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-glow transition-all active:scale-[0.98]">
          更新时间
        </button>
      </div>
    </div>
  );
};


const AddTimeRecordView: React.FC<AddTimeRecordViewProps> = ({ onCancel, onSave, initialData }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '工作');
  const [startTime, setStartTime] = useState(initialData?.startTime || '10:30');
  const [endTime, setEndTime] = useState(initialData?.endTime || '11:45');
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [title, setTitle] = useState(initialData?.title || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          if (!initialData?.category && data.length > 0) {
            setSelectedCategory(data[0].name);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, [initialData]);

  const colorConfig: Record<string, string> = {
    indigo: '#6366f1',
    amber: '#f59e0b',
    emerald: '#10b981',
    rose: '#f43f5e',
    purple: '#a855f7',
    sky: '#0ea5e9',
    orange: '#f97316',
    pink: '#ec4899',
    cyan: '#06b6d4',
    slate: '#64748b',
  };

  const currentCategory = useMemo(() => {
    const cat = categories.find(c => c.name === selectedCategory);
    return cat ? { ...cat, colorHex: colorConfig[cat.color] || '#6366f1' } : { name: '其他', color: 'indigo', colorHex: '#6366f1' };
  }, [selectedCategory, categories]);

  const duration = useMemo(() => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    let diff = endTotal - startTotal;
    if (diff < 0) {
      diff += 24 * 60;
    }

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return {
      text: `${hours}小时 ${minutes}分钟`,
      isNextDay: endTotal < startTotal
    };
  }, [startTime, endTime]);

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const period = h < 12 ? '上午' : '下午';
    let displayH = h;

    if (displayH > 12) displayH -= 12;
    if (displayH === 0) displayH = 12;
    if (displayH === 12 && h < 12) displayH = 12;

    const displayM = m.toString().padStart(2, '0');
    return `${period} ${displayH}:${displayM}`;
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);

      const startTotal = startH * 60 + startM;
      let endTotal = endH * 60 + endM;
      let diff = endTotal - startTotal;
      if (diff < 0) diff += 24 * 60;

      const payload = {
        title,
        startTime: startTotal,
        duration: diff,
        category: selectedCategory,
        color: currentCategory.color
      };

      const url = initialData?.id
        ? `http://localhost:4000/api/time-records/${initialData.id}`
        : 'http://localhost:4000/api/time-records';

      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSave();
      } else {
        alert('保存失败，请重试');
      }
    } catch (err) {
      console.error(err);
      alert('网络错误');
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !window.confirm('确定要删除这条记录吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/time-records/${initialData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onSave(); // Treat as save/success to close view
      } else {
        alert('删除失败');
      }
    } catch (err) {
      alert('网络错误');
    }
  };

  if (isEditingTime) {
    return (
      <EditTimeOverlay
        initialStartTime={startTime}
        initialEndTime={endTime}
        onCancel={() => setIsEditingTime(false)}
        onUpdate={(start, end) => {
          setStartTime(start);
          setEndTime(end);
          setIsEditingTime(false);
        }}
      />
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display h-screen overflow-hidden flex flex-col">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex w-12 items-center">
            <button onClick={onCancel} className="text-primary text-base font-medium">取消</button>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{initialData?.id ? '编辑记录' : '添加时间记录'}</h2>
          <div className="flex w-12 items-center justify-end">
            <button onClick={handleSave} className="text-primary text-base font-bold leading-normal tracking-[0.015em] shrink-0">保存</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-32 overflow-y-auto">
        {/* Activity Name Section */}
        <section className="mt-4">
          <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-4 opacity-60">活动名称</h3>
          <div className="px-4 py-1">
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] p-[15px] text-base font-normal leading-normal transition-colors outline-none"
                  placeholder="例如：UX 设计研究"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section className="mt-4">
          <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-4 opacity-60">分类</h3>
          <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
            {loadingCats ? (
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-20 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>)}
              </div>
            ) : categories.map((cat) => {
              const hex = colorConfig[cat.color] || '#6366f1';
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 transition-all duration-200 ${selectedCategory === cat.name
                    ? 'shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  style={selectedCategory === cat.name ? { backgroundColor: hex, color: 'white', shadowColor: `${hex}33` } : {}}
                >
                  <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  <p className="text-sm font-bold">{cat.name}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Time Range Section */}
        <section className="mt-4 px-4">
          <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider pb-2 pt-4 opacity-60">时间详情</h3>
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {/* Start Time */}
            <div
              onClick={() => setIsEditingTime(true)}
              className="relative flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer active:bg-slate-100 dark:active:bg-white/10"
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-500 text-[20px] filled">play_circle</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">开始时间</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg pointer-events-none flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-semibold">{formatTimeDisplay(startTime)}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>
              </div>
            </div>

            {/* End Time */}
            <div
              onClick={() => setIsEditingTime(true)}
              className="relative flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer active:bg-slate-100 dark:active:bg-white/10"
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-[20px] filled">stop_circle</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  结束时间
                  {duration.isNextDay && <span className="ml-2 text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold">+1 天</span>}
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg pointer-events-none flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-semibold">{formatTimeDisplay(endTime)}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>
              </div>
            </div>

            {/* Total Duration */}
            <div className="flex items-center justify-between p-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">持续时长</span>
              </div>
              <span className="font-bold" style={{ color: currentCategory.colorHex }}>{duration.text}</span>
            </div>
          </div>
        </section>

        {/* Delete Button (Only for existing records) */}
        {initialData?.id && (
          <section className="mt-8 px-4">
            <button
              onClick={handleDelete}
              className="w-full h-14 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
              删除此记录
            </button>
          </section>
        )}
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl max-w-md mx-auto z-20">
        <button
          onClick={handleSave}
          className="w-full text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-[0.98]"
          style={{ backgroundColor: currentCategory.colorHex, shadowColor: `${currentCategory.colorHex}4d` }}
        >
          保存记录
        </button>
      </div>
    </div>
  );
};

export default AddTimeRecordView;