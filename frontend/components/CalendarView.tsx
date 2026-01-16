import React, { useState, useRef, useEffect, useMemo } from 'react';
import { apiFetch, API_BASE_URL } from '../utils/api';

interface CalendarViewProps {
    onOpenNewEntry?: () => void;
    onStartFocus?: () => void;
    onCreateEvent?: (startTime: number) => void;
    onEditEvent?: (event: CalendarEvent) => void;
    onManageCategories?: () => void;
}

export interface CalendarEvent {
    id: string;
    title: string;
    subtitle: string;
    startTime: number; // minutes from midnight (e.g., 540 for 9:00 AM)
    duration: number; // minutes
    color: string;
    avatars?: string[];
    sortIndex?: number; // For horizontal ordering
}

const CalendarView: React.FC<CalendarViewProps> = ({ onOpenNewEntry, onStartFocus, onCreateEvent, onEditEvent, onManageCategories }) => {
    const [now, setNow] = useState(new Date());
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    // Generate dates for the current week starting from Sunday
    const weekDates = useMemo(() => {
        const d = new Date(now);
        const day = d.getDay();
        const diff = d.getDate() - day; // Back to Sunday
        const startOfWeek = new Date(d.setDate(diff));

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [now.toDateString()]); // Only recalculate when the day changes

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [activeTab, setActiveTab] = useState<'calendar' | 'focus'>('calendar');

    // Config
    const START_HOUR = 0; // Changed to 0 for full day
    const END_HOUR = 24; // Changed to 24 for full day
    const PIXELS_PER_MIN = 1.8; // Height of 1 minute in pixels
    const SNAP_MINUTES = 15; // Snap to 15 min blocks

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    // Initial Events State
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Focus Stats State
    const [focusStats, setFocusStats] = useState<{ totalMinutes: number; completedSessions: number }>({ totalMinutes: 0, completedSessions: 0 });

    // 格式化日期为 YYYY-MM-DD
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const fetchEvents = async (date: Date) => {
        const dateStr = formatDateForApi(date);
        const data = await apiFetch<any[]>(`${API_BASE_URL}/api/time-records?date=${dateStr}`);
        if (data) {
            const mapped = data.map((item: any) => {
                const category = item.category || 'Default';
                let colorKey = item.color || 'indigo';

                if (!item.color) {
                    if (category === '工作' || category === 'Work') colorKey = 'indigo';
                    else if (category === '学习' || category === 'Study') colorKey = 'amber';
                    else if (category === '运动' || category === 'Exercise') colorKey = 'emerald';
                    else if (category === '社交' || category === 'Social') colorKey = 'rose';
                    else if (category === '休息' || category === 'Rest') colorKey = 'purple';
                    else colorKey = 'indigo';
                }

                return {
                    id: item.id,
                    title: item.title,
                    subtitle: category,
                    startTime: item.startTime,
                    duration: item.duration,
                    color: colorKey,
                    sortIndex: 0
                };
            });
            setEvents(mapped);
            console.log(`%c[SYNC] CalendarView: Events fetched for ${dateStr}`, 'color: #6366f1; font-weight: bold;', mapped.length);
        }
    };

    const fetchFocusStats = async () => {
        const data = await apiFetch<{ totalMinutes: number; completedSessions: number }>(`${API_BASE_URL}/api/focus/today-stats`);
        if (data) {
            setFocusStats({
                totalMinutes: data.totalMinutes || 0,
                completedSessions: data.completedSessions || 0
            });
            console.log('%c[SYNC] FocusStats: Fetched today stats', 'color: #10b981; font-weight: bold;', data);
        }
    };

    // 滚动到当前时间的辅助函数
    const scrollToCurrentTime = () => {
        if (timelineRef.current) {
            const targetMinutes = Math.max(0, currentTotalMinutes - 120); // 当前时间 - 2小时
            const scrollTop = (targetMinutes - (START_HOUR * 60)) * PIXELS_PER_MIN;
            timelineRef.current.scrollTop = scrollTop;
            console.log('%c[SCROLL] Scrolled to current time', 'color: #8b5cf6; font-weight: bold;');
        }
    };

    // 组件首次挂载时：加载今天的数据并滚动到当前时间
    useEffect(() => {
        console.log('%c[INIT] CalendarView mounted. Fetching initial data...', 'color: #6366f1; font-weight: bold;');
        fetchEvents(selectedDate);
        // 延迟滚动，确保 DOM 渲染完成
        setTimeout(scrollToCurrentTime, 100);
    }, []);

    // selectedDate 变化时：重新获取该日期的数据
    useEffect(() => {
        if (activeTab === 'calendar') {
            console.log(`%c[SYNC] Date changed to ${formatDateForApi(selectedDate)}. Fetching records...`, 'color: #6366f1; font-weight: bold;');
            fetchEvents(selectedDate);
        }
    }, [selectedDate]);

    // Tab 切换时：获取对应数据，日历页面还要滚动到当前时间
    useEffect(() => {
        if (activeTab === 'calendar') {
            console.log('%c[SYNC] CalendarView: Tab changed to calendar. Fetching records...', 'color: #6366f1; font-weight: bold;');
            fetchEvents(selectedDate);
            // 延迟滚动，确保数据加载和 DOM 更新完成
            setTimeout(scrollToCurrentTime, 100);
        } else if (activeTab === 'focus') {
            console.log('%c[SYNC] CalendarView: Tab changed to focus. Fetching stats...', 'color: #6366f1; font-weight: bold;');
            fetchFocusStats();
        }
    }, [activeTab]);

    // Interaction State
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'move' | 'resize-top' | 'resize-bottom' | null>(null);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [draggedElementWidth, setDraggedElementWidth] = useState(0);
    const [initialEventState, setInitialEventState] = useState<{ startTime: number, duration: number } | null>(null);

    // Auto-scroll State
    const timelineRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasDraggedRef = useRef(false);
    const initialScrollTopRef = useRef(0);
    const lastPointerYRef = useRef(0);
    const autoScrollRafRef = useRef<number | null>(null);
    const autoScrollSpeedRef = useRef(0);

    // Layout Calculation Logic for Overlapping Events
    const eventLayouts = useMemo(() => {
        // 1. Sort events by start time to identify clusters
        const sortedByTime = [...events].sort((a, b) => a.startTime - b.startTime);

        // 2. Identify Clusters (Connected groups of overlapping events)
        const clusters: CalendarEvent[][] = [];
        if (sortedByTime.length > 0) {
            let currentCluster = [sortedByTime[0]];
            let clusterEnd = sortedByTime[0].startTime + sortedByTime[0].duration;

            for (let i = 1; i < sortedByTime.length; i++) {
                const ev = sortedByTime[i];
                if (ev.startTime < clusterEnd) {
                    currentCluster.push(ev);
                    clusterEnd = Math.max(clusterEnd, ev.startTime + ev.duration);
                } else {
                    clusters.push(currentCluster);
                    currentCluster = [ev];
                    clusterEnd = ev.startTime + ev.duration;
                }
            }
            clusters.push(currentCluster);
        }

        const layoutMap: Record<string, { width: string, left: string }> = {};

        // 3. Process each cluster
        clusters.forEach(cluster => {
            // Sort cluster members by custom sortIndex for visual ordering
            cluster.sort((a, b) => {
                const ia = a.sortIndex ?? 0;
                const ib = b.sortIndex ?? 0;
                if (ia !== ib) return ia - ib;
                return a.startTime - b.startTime;
            });

            // Simple column packing within cluster
            const columns: CalendarEvent[][] = [];
            cluster.forEach(ev => {
                let placed = false;
                for (let i = 0; i < columns.length; i++) {
                    const last = columns[i][columns[i].length - 1];
                    if (last.startTime + last.duration <= ev.startTime) {
                        columns[i].push(ev);
                        // Store visual column index temporarily
                        (ev as any)._colIndex = i;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    columns.push([ev]);
                    (ev as any)._colIndex = columns.length - 1;
                }
            });

            const numCols = columns.length;
            cluster.forEach(ev => {
                const colIndex = (ev as any)._colIndex;
                layoutMap[ev.id] = {
                    width: `${100 / numCols}%`,
                    left: `${(colIndex * 100) / numCols}%`
                };
            });
        });

        return layoutMap;
    }, [events]);

    // Helper: Format minutes to HH:MM period
    const formatTime = (minutes: number) => {
        let h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const period = h < 12 ? '上午' : '下午';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${period} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const getEventColor = (color: string, isBg = false) => {
        const colors: Record<string, any> = {
            indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', sub: 'text-indigo-400' },
            amber: { bg: 'bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-600 dark:text-amber-400', sub: 'text-amber-400' },
            emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', sub: 'text-emerald-400' },
            rose: { bg: 'bg-rose-500/10', border: 'border-rose-500', text: 'text-rose-600 dark:text-rose-400', sub: 'text-rose-400' },
            purple: { bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', sub: 'text-purple-400' },
        };
        return colors[color] || colors['indigo'];
    };

    // Interaction Handlers
    const handlePointerDown = (e: React.PointerEvent, event: CalendarEvent, mode: 'move' | 'resize-top' | 'resize-bottom') => {
        e.stopPropagation();
        e.preventDefault();

        hasDraggedRef.current = false; // Reset interaction state
        const clientY = e.clientY;
        const clientX = e.clientX;
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const width = rect.width;

        if (mode === 'move') {
            // For move, we wait for long press
            longPressTimerRef.current = setTimeout(() => {
                startDrag(clientX, clientY, event, mode, width);
                if (navigator.vibrate) navigator.vibrate(50);
            }, 400); // 400ms long press
        } else {
            // For resize, start immediately
            startDrag(clientX, clientY, event, mode, width);
        }
    };

    const handleClick = (e: React.MouseEvent, event: CalendarEvent) => {
        e.stopPropagation();
        // If we entered drag mode (even if we didn't move much), prevent edit
        if (hasDraggedRef.current) {
            return;
        }
        if (!draggingId && onEditEvent) {
            onEditEvent(event);
        }
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hasDraggedRef.current) return;

        const y = e.nativeEvent.offsetY;
        const minutesToAdd = y / PIXELS_PER_MIN;
        const totalMinutes = (START_HOUR * 60) + minutesToAdd;

        // Snap to 15 mins
        const snappedMinutes = Math.round(totalMinutes / SNAP_MINUTES) * SNAP_MINUTES;

        if (onCreateEvent) {
            onCreateEvent(snappedMinutes);
        }
    };

    const startDrag = (clientX: number, clientY: number, event: CalendarEvent, mode: 'move' | 'resize-top' | 'resize-bottom', width: number) => {
        hasDraggedRef.current = true;
        setDraggingId(event.id);
        setDragMode(mode);
        setDragStartY(clientY);
        setDragStartX(clientX);
        setDragX(0);
        setDraggedElementWidth(width);
        setInitialEventState({ startTime: event.startTime, duration: event.duration });

        // Auto Scroll Setup
        initialScrollTopRef.current = timelineRef.current?.scrollTop || 0;
        lastPointerYRef.current = clientY;
    };

    // Core Logic to update event based on Pointer Y and Scroll Offset
    const updateEventState = (clientY: number) => {
        if (!draggingId || !dragMode || !initialEventState || !timelineRef.current) return;

        const currentScrollTop = timelineRef.current.scrollTop;
        const scrollDelta = currentScrollTop - initialScrollTopRef.current;
        const mouseDelta = clientY - dragStartY;

        // The total movement is the mouse movement plus how much the container has scrolled
        const totalPixelDelta = mouseDelta + scrollDelta;

        const deltaMinutes = totalPixelDelta / PIXELS_PER_MIN;
        const snappedDelta = Math.round(deltaMinutes / SNAP_MINUTES) * SNAP_MINUTES;

        setEvents(prev => prev.map(ev => {
            if (ev.id !== draggingId) return ev;

            let newStart = initialEventState.startTime;
            let newDuration = initialEventState.duration;

            if (dragMode === 'move') {
                newStart = initialEventState.startTime + snappedDelta;
            } else if (dragMode === 'resize-bottom') {
                newDuration = Math.max(15, initialEventState.duration + snappedDelta);
            } else if (dragMode === 'resize-top') {
                newStart = initialEventState.startTime + snappedDelta;
                newDuration = Math.max(15, initialEventState.duration - snappedDelta);
            }

            // Boundary checks
            if (newStart < START_HOUR * 60) newStart = START_HOUR * 60;

            return { ...ev, startTime: newStart, duration: newDuration };
        }));
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        // If pressing but not dragging yet (waiting for long press), check movement tolerance
        if (!draggingId && longPressTimerRef.current) {
            // Simple tolerance check could go here, for now we rely on strict timing
            return;
        }

        if (!draggingId) return;
        e.preventDefault();

        if (dragMode === 'move') {
            const currentX = e.clientX - dragStartX;
            setDragX(currentX);

            // Horizontal Swap Logic: If dragged more than half width
            if (draggedElementWidth > 0 && Math.abs(currentX) > draggedElementWidth / 2) {
                const draggedEvent = events.find(ev => ev.id === draggingId);
                if (draggedEvent) {
                    // 1. Identify Overlapping Events (The Cluster)
                    const overlaps = events.filter(ev => {
                        const maxStart = Math.max(ev.startTime, draggedEvent.startTime);
                        const minEnd = Math.min(ev.startTime + ev.duration, draggedEvent.startTime + draggedEvent.duration);
                        return maxStart < minEnd;
                    });

                    // 2. Sort by current effective visual order
                    overlaps.sort((a, b) => {
                        const ia = a.sortIndex ?? 0;
                        const ib = b.sortIndex ?? 0;
                        if (ia !== ib) return ia - ib;
                        return a.startTime - b.startTime;
                    });

                    // 3. Find current index of dragged event
                    const currentIndex = overlaps.findIndex(ev => ev.id === draggingId);

                    if (currentIndex !== -1) {
                        let targetIndex = currentIndex;

                        // Move Right
                        if (currentX > 0 && currentIndex < overlaps.length - 1) {
                            targetIndex = currentIndex + 1;
                        }
                        // Move Left
                        else if (currentX < 0 && currentIndex > 0) {
                            targetIndex = currentIndex - 1;
                        }

                        if (targetIndex !== currentIndex) {
                            // 4. Normalize Indices (0, 1, 2...)
                            const newSortIndices = overlaps.map((_, i) => i);

                            // 5. Swap indices in the normalized array
                            const temp = newSortIndices[currentIndex];
                            newSortIndices[currentIndex] = newSortIndices[targetIndex];
                            newSortIndices[targetIndex] = temp;

                            // 6. Update events with new sortIndices
                            const updates = new Map<string, number>();
                            overlaps.forEach((ev, i) => {
                                updates.set(ev.id, newSortIndices[i]);
                            });

                            setEvents(prev => prev.map(ev => {
                                if (updates.has(ev.id)) {
                                    return { ...ev, sortIndex: updates.get(ev.id) };
                                }
                                return ev;
                            }));

                            // 7. Adjust Drag Origin to prevent jumping
                            // We moved one "column" (approx width)
                            const direction = targetIndex > currentIndex ? 1 : -1;
                            setDragStartX(prev => prev + (direction * draggedElementWidth));
                            setDragX(prev => prev - (direction * draggedElementWidth));
                        }
                    }
                }
            }
        }

        lastPointerYRef.current = e.clientY;
        updateEventState(e.clientY);

        // Auto Scroll Detection
        if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const threshold = 60; // px from edge
            const bottomEdge = rect.bottom - threshold;
            const topEdge = rect.top + threshold;

            if (e.clientY > bottomEdge) {
                // Scale speed by distance
                const ratio = (e.clientY - bottomEdge) / threshold;
                autoScrollSpeedRef.current = 2 + (15 * Math.min(ratio, 1)); // Max speed 17
                if (!autoScrollRafRef.current) startAutoScrollLoop();
            } else if (e.clientY < topEdge) {
                const ratio = (topEdge - e.clientY) / threshold;
                autoScrollSpeedRef.current = -(2 + (15 * Math.min(ratio, 1)));
                if (!autoScrollRafRef.current) startAutoScrollLoop();
            } else {
                autoScrollSpeedRef.current = 0;
                stopAutoScrollLoop();
            }
        }
    };

    const startAutoScrollLoop = () => {
        const loop = () => {
            if (timelineRef.current && autoScrollSpeedRef.current !== 0) {
                timelineRef.current.scrollTop += autoScrollSpeedRef.current;
                // IMPORTANT: Update event position while scrolling even if mouse is still
                updateEventState(lastPointerYRef.current);
                autoScrollRafRef.current = requestAnimationFrame(loop);
            } else {
                stopAutoScrollLoop();
            }
        };
        autoScrollRafRef.current = requestAnimationFrame(loop);
    };

    const stopAutoScrollLoop = () => {
        if (autoScrollRafRef.current) {
            cancelAnimationFrame(autoScrollRafRef.current);
            autoScrollRafRef.current = null;
        }
    };

    const handlePointerUp = async () => {
        // If we were dragging, sync to backend
        if (draggingId) {
            const draggedEvent = events.find(ev => ev.id === draggingId);
            if (draggedEvent && hasDraggedRef.current) {
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:4000/api/time-records/${draggedEvent.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title: draggedEvent.title,
                            startTime: draggedEvent.startTime,
                            duration: draggedEvent.duration,
                            category: draggedEvent.subtitle,
                            color: draggedEvent.color === 'indigo' ? '#6366f1' : (draggedEvent.color === 'amber' ? '#f59e0b' : '#10b981')
                        })
                    });
                } catch (err) {
                    console.error('Failed to sync event update', err);
                }
            }
        }

        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        // Delay reset to allow any pending 'click' events (like handleClick) to see the true value
        setTimeout(() => {
            hasDraggedRef.current = false;
        }, 100);

        setDraggingId(null);
        setDragMode(null);
        setDragX(0);
        setInitialEventState(null);
        stopAutoScrollLoop();
        autoScrollSpeedRef.current = 0;
    };

    // Global pointer listeners for drag continuity
    useEffect(() => {
        if (draggingId) {
            window.addEventListener('pointermove', handlePointerMove as any);
            window.addEventListener('pointerup', handlePointerUp);
        } else {
            window.removeEventListener('pointermove', handlePointerMove as any);
            window.removeEventListener('pointerup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove as any);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [draggingId, dragMode, dragStartY, dragStartX, dragX, draggedElementWidth, initialEventState, events]);

    // Render Time Grid Lines
    const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Fixed Header: Top Bar + Week Strip + Start Focus Button */}
            <div className="shrink-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
                {/* Top Nav Row */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <button
                        onClick={onManageCategories}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">tune</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{now.getFullYear()}年 {now.getMonth() + 1}月</h2>
                        <span className="text-[10px] font-bold uppercase text-primary tracking-widest">今天</span>
                    </div>
                    <div className="flex items-center justify-center size-10">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">calendar_today</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 px-4 pb-4">
                    {/* Segmented Control Tab Switcher */}
                    <div className="relative w-full p-1 flex bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/10 rounded-xl shadow-sm transition-all duration-300 ease-out-expo ${activeTab === 'focus' ? 'translate-x-full' : 'translate-x-0'}`}
                            style={{ filter: activeTab === 'focus' ? 'drop-shadow(0 0 8px rgba(0, 242, 255, 0.2))' : 'none' }}
                        ></div>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors z-10 ${activeTab === 'calendar' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            <span>日历</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('focus')}
                            className={`relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors z-10 ${activeTab === 'focus' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                            <span className="material-symbols-outlined text-lg">timer</span>
                            <span>专注</span>
                        </button>
                    </div>

                    {/* Conditional rendering for Calendar-specific header parts */}
                    {activeTab === 'calendar' && (
                        <div className="w-full">
                            <div className="grid grid-cols-7 mb-2">
                                {weekDays.map((d, i) => (
                                    <p key={i} className="text-[11px] font-bold text-center text-slate-400 dark:text-slate-500">{d}</p>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">
                                {weekDates.map((dateObj) => {
                                    const date = dateObj.getDate();
                                    const isToday = dateObj.toDateString() === now.toDateString();
                                    const isSelected = selectedDate.toDateString() === dateObj.toDateString();

                                    return (
                                        <div key={date} className="flex items-center justify-center h-10 cursor-pointer" onClick={() => setSelectedDate(new Date(dateObj))}>
                                            <div className={`flex items-center justify-center size-9 rounded-full text-sm font-medium transition-all ${isSelected
                                                ? 'bg-primary text-white font-bold shadow-glow'
                                                : isToday
                                                    ? 'border border-primary text-primary font-bold'
                                                    : 'text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                                                }`}>
                                                {date}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32" ref={timelineRef} style={{ touchAction: draggingId ? 'none' : 'auto' }}>
                {activeTab === 'calendar' ? (
                    <div
                        className="relative w-full border-t border-slate-100 dark:border-slate-800/50"
                        style={{ height: (END_HOUR - START_HOUR) * 60 * PIXELS_PER_MIN + 100 }}
                        onClick={handleTimelineClick}
                        onPointerDown={() => { hasDraggedRef.current = false; }}
                    >
                        {/* Background Grid */}
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full flex items-center group pointer-events-none"
                                style={{ top: (hour - START_HOUR) * 60 * PIXELS_PER_MIN }}
                            >
                                <div className="w-16 text-right pr-4 text-[10px] font-bold text-slate-400 dark:text-slate-600 -translate-y-1/2">
                                    {hour}:00
                                </div>
                                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                            </div>
                        ))}

                        {/* Current Time Line */}
                        <div
                            className="absolute w-full flex items-center z-10 pointer-events-none"
                            style={{ top: (currentTotalMinutes - (START_HOUR * 60)) * PIXELS_PER_MIN }}
                        >
                            <div className="w-16"></div>
                            <div className="relative flex-1">
                                <div className="absolute -left-[5px] top-[-5px] size-2.5 rounded-full bg-primary shadow-glow"></div>
                                <div className="h-[2px] w-full bg-primary"></div>
                                <span className="absolute left-2 -top-6 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                                    {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* Events Wrapper */}
                        <div className="absolute inset-0 left-16 right-4 pointer-events-none">
                            {events.map((ev) => {
                                const top = (ev.startTime - (START_HOUR * 60)) * PIXELS_PER_MIN;
                                const height = ev.duration * PIXELS_PER_MIN;
                                const styles = getEventColor(ev.color);
                                const isDraggingThis = draggingId === ev.id;
                                const layout = eventLayouts[ev.id] || { width: '100%', left: '0%' };

                                return (
                                    <div
                                        key={ev.id}
                                        className={`absolute transition-all pointer-events-auto ${isDraggingThis ? 'z-50 scale-[1.02] opacity-90' : 'z-10'}`}
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            width: layout.width,
                                            left: layout.left,
                                            transform: isDraggingThis ? `translateX(${dragX}px)` : undefined,
                                        }}
                                        onClick={(e) => handleClick(e, ev)}
                                    >
                                        {/* Card Body */}
                                        <div
                                            className={`relative w-full h-full rounded-xl border-l-4 overflow-hidden select-none touch-none ${styles.bg} ${styles.border}`}
                                            onPointerDown={(e) => handlePointerDown(e, ev, 'move')}
                                        >
                                            {/* Top Resize Handle */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-4 w-full cursor-ns-resize z-20 hover:bg-white/10 active:bg-white/20"
                                                onPointerDown={(e) => handlePointerDown(e, ev, 'resize-top')}
                                            >
                                                <div className="mx-auto w-8 h-1 bg-slate-400/20 rounded-full mt-1"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 pt-4 h-full flex flex-col justify-center">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex flex-col min-w-0">
                                                        {/* Time Label */}
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight mb-0.5 block">
                                                            {formatTime(ev.startTime)}
                                                        </span>
                                                        <h4 className={`text-sm font-bold leading-tight truncate ${styles.text}`}>{ev.title}</h4>
                                                    </div>
                                                    {ev.avatars && (
                                                        <div className="flex -space-x-2 shrink-0">
                                                            {ev.avatars.map((av, i) => (
                                                                <div key={i} className="size-5 rounded-full border-2 border-background-dark bg-cover" style={{ backgroundImage: `url('${av}')` }}></div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className={`mt-0.5 text-[10px] font-medium truncate ${styles.sub}`}>
                                                    {ev.subtitle} • {Math.round(ev.duration)} 分钟
                                                </p>
                                            </div>

                                            {/* Bottom Resize Handle */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-4 w-full cursor-ns-resize z-20 hover:bg-white/10 active:bg-white/20 flex items-end"
                                                onPointerDown={(e) => handlePointerDown(e, ev, 'resize-bottom')}
                                            >
                                                <div className="mx-auto w-8 h-1 bg-slate-400/20 rounded-full mb-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Focus Tab Content */
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                        {/* Summary Header */}
                        <div className="mb-12">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Focus Hub • 专注中心</span>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">保持专注，<br />成就伟大。</h3>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">今日专注</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{focusStats.totalMinutes} <span className="text-xs font-medium opacity-50">分钟</span></span>
                                </div>
                                <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">完成组数</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{focusStats.completedSessions} <span className="text-xs font-medium opacity-50">组</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Focus Hub Center - Precise Interaction Zone with Geometric Validation */}
                        <div className="relative size-80 flex items-center justify-center">
                            {/* Decorative Background - Non-interactive */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
                                <div className="absolute inset-[-20px] rounded-full border border-primary/10 animate-ping [animation-duration:3s]"></div>
                                <div className="absolute inset-[-40px] rounded-full border border-primary/5 animate-ping [animation-duration:4s]"></div>
                            </div>

                            {/* Precise Action Button - Uses geometric validation for click accuracy */}
                            <button
                                className="relative z-50 size-48 rounded-full bg-white dark:bg-card-dark border-4 border-primary flex flex-col items-center justify-center shadow-glow-lg active:scale-95 transition-all cursor-pointer overflow-hidden p-0 m-0"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    // Geometric validation: only trigger if click is inside the circular button
                                    const button = e.currentTarget;
                                    const rect = button.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;
                                    const radius = rect.width / 2;

                                    const clickX = e.clientX;
                                    const clickY = e.clientY;
                                    const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));

                                    if (distance <= radius) {
                                        console.log('%c[DEBUG] Focus Hub: Precise Click Triggered.', 'color: #10b981; font-weight: bold;');
                                        onStartFocus?.();
                                    } else {
                                        console.log('%c[DEBUG] Focus Hub: Click outside button radius, ignored.', 'color: #f59e0b;');
                                    }
                                }}
                            >
                                <div className="flex flex-col items-center justify-center w-full h-full hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-5xl text-primary filled mb-2">timer</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">开始专注</span>
                                </div>
                            </button>
                        </div>

                        <p className="mt-12 text-xs font-medium text-slate-400 dark:text-white/40 max-w-[200px] leading-relaxed">
                            点击开始一个经典的番茄钟，<br />让时间流逝变得有意义
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
