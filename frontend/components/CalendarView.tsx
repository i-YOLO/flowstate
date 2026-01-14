import React, { useState, useRef, useEffect, useMemo } from 'react';

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
    const [selectedDate, setSelectedDate] = useState<number>(5);
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const dates = [1, 2, 3, 4, 5, 6, 7];

    // Config
    const START_HOUR = 0; // Changed to 0 for full day
    const END_HOUR = 24; // Changed to 24 for full day
    const PIXELS_PER_MIN = 1.8; // Height of 1 minute in pixels
    const SNAP_MINUTES = 15; // Snap to 15 min blocks

    // Simulated Current Time (matching the red line visualization)
    const CURRENT_TIME_HOUR = 11;
    const CURRENT_TIME_MIN = 15;

    // Initial Events State
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/time-records', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Map backend response to local CalendarEvent interface
                const mapped = data.map((item: any) => {
                    const category = item.category || 'Default';
                    // Support both Chinese and English categories for coloring
                    let colorKey = item.color || 'indigo'; // Use backend color if provided

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
            }
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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

    // Auto-scroll to Current Time - 2h on Mount
    useEffect(() => {
        if (timelineRef.current) {
            const currentTotalMinutes = CURRENT_TIME_HOUR * 60 + CURRENT_TIME_MIN;
            const targetMinutes = Math.max(0, currentTotalMinutes - 120); // Current Time - 2h
            const scrollTop = (targetMinutes - (START_HOUR * 60)) * PIXELS_PER_MIN;

            timelineRef.current.scrollTop = scrollTop;
        }
    }, []);

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
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2024年 9月</h2>
                        <span className="text-[10px] font-bold uppercase text-primary tracking-widest">今天</span>
                    </div>
                    <div className="flex items-center justify-center size-10">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">calendar_today</span>
                    </div>
                </div>

                {/* Week Strip */}
                <div className="px-4 pb-2">
                    <div className="grid grid-cols-7 mb-2">
                        {weekDays.map((d, i) => (
                            <p key={i} className="text-[11px] font-bold text-center text-slate-400 dark:text-slate-500">{d}</p>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                        {dates.map((date) => (
                            <div key={date} className="flex items-center justify-center h-10 cursor-pointer" onClick={() => setSelectedDate(date)}>
                                <div className={`flex items-center justify-center size-9 rounded-full text-sm font-medium transition-all ${selectedDate === date
                                    ? 'bg-primary text-white font-bold shadow-glow'
                                    : 'text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}>
                                    {date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start Focus Button - Fixed here */}
                <div className="px-4 mb-4">
                    <button
                        onClick={onStartFocus}
                        className="w-full flex items-center justify-center gap-2 h-12 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm active:scale-[0.99] transition-all group"
                    >
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary text-[16px]">play_arrow</span>
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">开始专注模式</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32" ref={timelineRef} style={{ touchAction: draggingId ? 'none' : 'auto' }}>

                {/* Timeline Area */}
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

                    {/* Current Time Line (Simulated 11:15) */}
                    <div
                        className="absolute w-full flex items-center z-10 pointer-events-none"
                        style={{ top: ((CURRENT_TIME_HOUR * 60 + CURRENT_TIME_MIN) - (START_HOUR * 60)) * PIXELS_PER_MIN }}
                    >
                        <div className="w-16"></div>
                        <div className="relative flex-1">
                            <div className="absolute -left-[5px] top-[-5px] size-2.5 rounded-full bg-primary shadow-glow"></div>
                            <div className="h-[2px] w-full bg-primary"></div>
                            <span className="absolute left-2 -top-6 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">{CURRENT_TIME_HOUR}:{CURRENT_TIME_MIN}</span>
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
            </div>
        </div>
    );
};

export default CalendarView;