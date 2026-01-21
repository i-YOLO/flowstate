import React, { useEffect, useState } from 'react';

interface DateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

const DateSelectionModal: React.FC<DateSelectionModalProps> = ({ 
    isOpen, 
    onClose, 
    activeFrequency, 
    selectedDate, 
    onSelectDate 
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setAnimateIn(true));
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen && !animateIn) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDateClick = (date: Date) => {
        onSelectDate(date);
        onClose();
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const renderDailyCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
        
        // Adjust for Monday start if preferred, but Sunday start is standard
        // Let's assume standard Sunday start for simplicity, match "日历" expectation
        
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            days.push(
                <button
                    key={i}
                    onClick={() => handleDateClick(date)}
                    className={`h-10 w-10 text-sm font-medium rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                            ? 'bg-accent-blue text-slate-900 shadow-glow-blue' 
                            : isToday
                                ? 'bg-white/10 text-accent-blue border border-accent-blue/50'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        return (
            <div className="grid grid-cols-7 gap-1 mt-4">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="h-8 flex items-center justify-center text-slate-500 text-xs">{d}</div>
                ))}
                {days}
            </div>
        );
    };

    const renderWeeklyPicker = () => {
        // Show list of weeks for current month
        const weeks = [];
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        // Start from first day of month
        let d = new Date(year, month, 1);
        // Align to Monday? Or Sunday? Let's say Monday start for business/habit logic usually
        // Adjust to previous Monday
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
        d.setDate(diff); // First Monday of the week containing (or just before) 1st of month

        // Generate 5-6 weeks
        for (let i = 0; i < 6; i++) {
            const startOfWeek = new Date(d);
            const endOfWeek = new Date(d);
            endOfWeek.setDate(d.getDate() + 6);
            
            // Check if this week overlaps with current month
            if (startOfWeek.getMonth() !== month && endOfWeek.getMonth() !== month && startOfWeek.getMonth() > month) break; // Optimization
            
            const isSelected = selectedDate >= startOfWeek && selectedDate <= endOfWeek;
            
            weeks.push(
                <button
                    key={i}
                    onClick={() => handleDateClick(new Date(startOfWeek))}
                    className={`w-full p-4 mb-2 rounded-xl text-left transition-all border ${
                        isSelected
                            ? 'bg-accent-blue/10 border-accent-blue text-white shadow-glow-blue'
                            : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                    }`}
                >
                    <div className="font-bold text-sm">
                        {isSelected ? '当前选择' : `第 ${i + 1} 周`}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                        {startOfWeek.toLocaleDateString()} - {endOfWeek.toLocaleDateString()}
                    </div>
                </button>
            );
            
            d.setDate(d.getDate() + 7);
        }
        
        return <div className="mt-4 flex flex-col">{weeks}</div>;
    };

    const renderMonthlyPicker = () => {
        const year = currentMonth.getFullYear();
        const months = [];
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(year, i, 1);
            const isSelected = date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
            const isCurrentMonth = i === new Date().getMonth() && year === new Date().getFullYear();
            
            months.push(
                <button
                    key={i}
                    onClick={() => handleDateClick(date)}
                    className={`p-3 rounded-xl transition-all border ${
                        isSelected
                            ? 'bg-accent-blue text-slate-900 font-bold shadow-glow-blue'
                            : isCurrentMonth
                                ? 'bg-white/10 text-accent-blue border border-accent-blue/30'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10 border-transparent'
                    }`}
                >
                    {i + 1}月
                </button>
            );
        }
        
        return <div className="grid grid-cols-3 gap-3 mt-4">{months}</div>;
    };

    const prevMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentMonth(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentMonth(newDate);
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
                animateIn && isOpen ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
            }`}
            onClick={handleBackdropClick}
        >
            <div 
                className={`bg-[#0F172A] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm m-0 sm:m-4 transform transition-all duration-300 ease-spring ${
                    animateIn && isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full sm:translate-y-10 opacity-0 scale-95'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                     <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                     </button>
                     <div className="font-bold text-lg text-white">
                        {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
                     </div>
                     <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                     </button>
                </div>

                {/* Content based on frequency */}
                {activeFrequency === 'DAILY' && renderDailyCalendar()}
                {activeFrequency === 'WEEKLY' && renderWeeklyPicker()}
                {activeFrequency === 'MONTHLY' && renderMonthlyPicker()}

                {/* Footer / Cancel */}
                <button 
                    onClick={onClose}
                    className="w-full mt-6 py-3 rounded-xl bg-white/5 text-slate-400 font-medium hover:bg-white/10 transition-colors"
                >
                    取消
                </button>
            </div>
        </div>
    );
};

export default DateSelectionModal;
