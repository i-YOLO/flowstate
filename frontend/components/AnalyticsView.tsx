import React, { useState, useEffect, useRef } from 'react';
import HeatMap from '@uiw/react-heat-map';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { apiFetch, API_BASE_URL } from '../utils/api';

interface AnalyticsViewProps {
  onBack?: () => void;
}

interface TimeAllocationData {
  totalFocus: string;
  comparison: string;
  categories: Array<{
    category: string;
    displayName: string;
    minutes: number;
    formatted: string;
    percentage: number;
  }>;
  dailyData?: Array<{
    date: string;
    categoryMinutes: { [key: string]: number };
    totalMinutes: number;
  }>;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('周');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'donut' | 'line' | 'bar'>('donut');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Analytics data states
  const [timeAllocation, setTimeAllocation] = useState<TimeAllocationData | null>(null);
  const [habitConsistency, setHabitConsistency] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any>(null);

  // Scroll heatmap to end on load
  const heatmapScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAnalytics();
    setMounted(true);
  }, [activeTab, customStartDate, customEndDate]);

  // 自动滚动到热力图最右侧（最新日期）
  useEffect(() => {
    if (heatmapScrollRef.current) {
      setTimeout(() => {
        heatmapScrollRef.current!.scrollLeft = heatmapScrollRef.current!.scrollWidth;
      }, 100);
    }
  }, [heatmapData, activeTab]);

  const getDateRange = (period: string): { startDate: string; endDate: string } => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (period) {
      case '日':
        return { startDate: today, endDate: today };
      case '周': {
        // 显示最近7天（当天减去7天）
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 6); // 包括今天共7天
        return {
          startDate: weekStart.toISOString().split('T')[0],
          endDate: today
        };
      }
      case '月': {
        // 显示最近30天（当天减去30天）
        const monthStart = new Date(now);
        monthStart.setDate(now.getDate() - 29); // 包括今天共30天
        return {
          startDate: monthStart.toISOString().split('T')[0],
          endDate: today
        };
      }
      case '年': {
        // 显示最近365天（近1年）
        const yearStart = new Date(now);
        yearStart.setDate(now.getDate() - 364); // 包括今天共365天
        return {
          startDate: yearStart.toISOString().split('T')[0],
          endDate: today
        };
      }
      case '自定义': {
        if (customStartDate && customEndDate) {
          return {
            startDate: customStartDate,
            endDate: customEndDate
          };
        }
        // 默认返回最近7天
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 6);
        return {
          startDate: weekStart.toISOString().split('T')[0],
          endDate: today
        };
      }
      default:
        return { startDate: today, endDate: today };
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(activeTab);

      // Fetch all analytics data in parallel
      const [timeAllocationRes, habitConsistencyRes, heatmapRes, achievementsRes] = await Promise.all([
        apiFetch(`/api/analytics/time-allocation?startDate=${startDate}&endDate=${endDate}`),
        apiFetch(`/api/analytics/habit-consistency?startDate=${startDate}&endDate=${endDate}`),
        // Pass date range for heatmap to ensure data coverage across years
        apiFetch(`/api/analytics/heatmap?startDate=${new Date(Date.now() - 175 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&endDate=${new Date().toISOString().split('T')[0]}`),
        apiFetch(`/api/analytics/achievements?startDate=${startDate}&endDate=${endDate}`)
      ]);

      setTimeAllocation(timeAllocationRes);
      setHabitConsistency(habitConsistencyRes);
      
      // Fix: Normalize date format to YYYY/MM/DD for HeatMap compatibility
      const rawHeatmapData = heatmapRes?.data || [];
      const formattedHeatmapData = rawHeatmapData.map((item: any) => ({
        ...item,
        date: item.date.replace(/-/g, '/')
      }));
      setHeatmapData(formattedHeatmapData);
      
      setAchievements(achievementsRes);
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // 即使失败也设置空数据，避免界面崩溃
      setTimeAllocation(null);
      setHabitConsistency(null);
      setHeatmapData([]);
      setAchievements(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = timeAllocation?.categories || [];
  
  // Calculate pie segments with proper offset
  let currentOffset = 0;
  const pieSegments = chartData.map((data) => {
    const segmentLength = data.percentage;
    const offset = currentOffset;
    currentOffset += segmentLength;
    return {
      ...data,
      strokeDasharray: mounted ? `${segmentLength} ${100 - segmentLength}` : `0 100`,
      strokeDashoffset: mounted ? -(offset) : 0
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background-dark font-display text-white no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background-dark/80 ios-blur border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center w-10">
                <button onClick={onBack} className="flex items-center justify-center transition-colors hover:text-white text-gray-400">
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">统计分析</h1>
            <div className="flex items-center justify-end w-10">
                <span className="cursor-pointer material-symbols-outlined text-2xl text-gray-400">calendar_today</span>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 pb-1">
            <div className="flex gap-8 overflow-x-auto border-b border-white/5 no-scrollbar">
                {['日', '周', '月', '年', '自定义'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          if (tab === '自定义') {
                            setShowDatePicker(true);
                          }
                        }}
                        className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-2 transition-colors min-w-[3rem] ${
                            activeTab === tab 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <p className="text-sm font-bold leading-normal tracking-wide">{tab}</p>
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4 pb-32">
        
        {/* Time Allocation Chart */}
        <section className="p-4 sm:p-6 border rounded-2xl bg-card-dark glow-card border-white/5">
            <div className="flex items-center justify-between mb-6 gap-2">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-100 whitespace-nowrap flex-shrink-0">时间分配</h3>
                <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink">
                  {/* Chart Type Switcher */}
                  <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 border rounded-lg bg-white/5 border-white/10">
                    <button
                      onClick={() => setChartType('donut')}
                      className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all ${
                        chartType === 'donut'
                          ? 'bg-primary text-black'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      环形
                    </button>
                    {/* 折线图仅在周/月/年/自定义显示 */}
                    {activeTab !== '日' && (
                      <button
                        onClick={() => setChartType('line')}
                        className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all ${
                          chartType === 'line'
                            ? 'bg-primary text-black'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        折线
                      </button>
                    )}
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all ${
                        chartType === 'bar'
                          ? 'bg-primary text-black'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      柱形
                    </button>
                  </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* No Data Message */}
                {(!timeAllocation || chartData.length === 0) && (
                  <div className="w-full py-12 text-center">
                    <p className="text-gray-400 text-sm mb-2">暂无数据</p>
                    <p className="text-gray-500 text-xs">后端 Analytics API 接口开发中...</p>
                  </div>
                )}

                {/* Donut Chart */}
                {chartType === 'donut' && timeAllocation && chartData.length > 0 && (
                  <div className="w-full">
                    <div className="relative flex items-center justify-center w-52 h-52 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            {/* Background Ring */}
                            <circle className="stroke-white/5 fill-none" cx="18" cy="18" r="15.9" strokeWidth="3.5"></circle>
                            {/* Dynamic Segments */}
                            {pieSegments.map((segment, index) => (
                              <circle
                                key={segment.category}
                                className={`fill-none transition-all duration-500 ease-out ${
                                  index === 0 ? 'stroke-primary glow-cyan' :
                                  index === 1 ? 'stroke-accent-orange glow-orange' :
                                  'stroke-accent-purple glow-purple'
                                }`}
                                cx="18"
                                cy="18"
                                r="15.9"
                                strokeDasharray={segment.strokeDasharray}
                                strokeDashoffset={segment.strokeDashoffset}
                                strokeLinecap="round"
                                strokeWidth="3.5"
                              ></circle>
                            ))}
                        </svg>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{timeAllocation?.totalFocus || '0h'}</span>
                            <span className="text-[9px] uppercase font-black tracking-widest text-gray-500 mt-1">总专注时长</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid w-full grid-cols-1 gap-3">
                        {chartData.map((item, index) => (
                          <div key={item.category} className="flex items-center justify-between p-3 border rounded-xl bg-white/5 border-white/5">
                              <div className="flex items-center gap-3">
                                  <div className={`rounded-full size-2.5 ${
                                    index === 0 ? 'bg-primary glow-cyan' :
                                    index === 1 ? 'bg-accent-orange glow-orange' :
                                    'bg-accent-purple glow-purple'
                                  }`}></div>
                                  <span className="text-sm font-semibold text-gray-300">{item.displayName}</span>
                              </div>
                              <span className="text-sm font-black text-white">{item.formatted}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Line Chart */}
                {chartType === 'line' && (() => {
                  // 填充完整日期范围的数据
                  const { startDate, endDate } = getDateRange(activeTab);
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  
                  // 创建日期到数据的映射
                  const dataMap = new Map<string, number>();
                  (timeAllocation?.dailyData || []).forEach(d => {
                    dataMap.set(d.date, d.totalMinutes);
                  });
                  
                  // 根据视图类型决定聚合策略
                  const isYearView = activeTab === '年';
                  const aggregationDays = isYearView ? 15 : 1; // 年视图每15天聚合
                  
                  // 生成聚合数据
                  const completeData = [];
                  const current = new Date(start);
                  let dayIndex = 0;
                  
                  while (current <= end) {
                    if (dayIndex % aggregationDays === 0 || current.getTime() === end.getTime()) {
                      // 计算当前聚合周期的总时长
                      let periodTotal = 0;
                      let periodDays = 0;
                      const periodStart = new Date(current);
                      
                      for (let i = 0; i < aggregationDays && new Date(periodStart.getTime() + i * 24 * 60 * 60 * 1000) <= end; i++) {
                        const checkDate = new Date(periodStart.getTime() + i * 24 * 60 * 60 * 1000);
                        const dateStr = checkDate.toISOString().split('T')[0];
                        periodTotal += dataMap.get(dateStr) || 0;
                        periodDays++;
                      }
                      
                      const dateStr = current.toISOString().split('T')[0];
                      completeData.push({
                        date: new Date(dateStr).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
                        totalMinutes: periodTotal,
                        hours: (periodTotal / 60).toFixed(1),
                        dayIndex: dayIndex,
                        hasData: periodTotal > 0,
                        periodDays: periodDays
                      });
                    }
                    
                    current.setDate(current.getDate() + (isYearView ? aggregationDays : 1));
                    dayIndex += (isYearView ? aggregationDays : 1);
                  }
                  
                  // 根据数据量决定显示策略
                  const isMonthView = !isYearView && completeData.length > 14;
                  const dotSize = isYearView ? 4 : (isMonthView ? 3 : 5);
                  const activeDotSize = isYearView ? 6 : (isMonthView ? 5 : 7);
                  const showInterval = isYearView ? 1 : (isMonthView ? 4 : 0);
                  
                  return (
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={completeData}
                          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            interval={showInterval}
                            angle={isMonthView || isYearView ? -45 : 0}
                            textAnchor={isMonthView || isYearView ? 'end' : 'middle'}
                            height={isMonthView || isYearView ? 60 : 30}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            label={{ value: '时长 (分钟)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af', fontSize: 10 } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#161b22', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: any, name: string, props: any) => {
                              if (name === 'totalMinutes') {
                                const hours = Math.floor(value / 60);
                                const mins = value % 60;
                                const periodInfo = isYearView ? ` (${props.payload.periodDays}天)` : '';
                                return [`${hours}h${mins}m${periodInfo}`, '总时长'];
                              }
                              return [value, name];
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="totalMinutes" 
                            stroke="#00f2ff" 
                            strokeWidth={2}
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              if (!payload.hasData) return null;
                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={dotSize}
                                  fill="#00f2ff"
                                  className="glow-cyan"
                                />
                              );
                            }}
                            activeDot={{ r: activeDotSize }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}

                {/* Bar Chart */}
                {chartType === 'bar' && (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="displayName" 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          label={{ value: '时长 (分钟)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af', fontSize: 10 } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#161b22', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                          formatter={(value: any) => {
                            const hours = Math.floor(Number(value) / 60);
                            const mins = Number(value) % 60;
                            return [`${hours}h${mins}m`, '时长'];
                          }}
                        />
                        <Bar dataKey="minutes">
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={index === 0 ? '#00f2ff' : index === 1 ? '#ff8c42' : '#a855f7'}
                              className={index === 0 ? 'glow-cyan' : index === 1 ? 'glow-orange' : 'glow-purple'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </div>
        </section>

        {/* Habit Heatmap */}
        <section className="p-4 sm:p-6 border rounded-2xl bg-card-dark glow-card border-white/5">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-100 mb-6 whitespace-nowrap">习惯热力图</h3>
          
          <div ref={heatmapScrollRef} className="w-full overflow-x-auto no-scrollbar">
            <HeatMap
              value={heatmapData}
              style={{
                color: '#9ca3af',
                fontSize: 10,
              }}
              panelColors={{
                0: 'rgba(255,255,255,0.03)',
                60: '#0e4429',   // Level 1: Dark Dim Green
                120: '#006d32',  // Level 2: Medium Green
                180: '#26a641',  // Level 3: Bright Green
                240: '#39d353',  // Level 4: Neon Green (Highest)
              }}
              // 显示最近6个月的数据
              startDate={new Date(new Date().setHours(0,0,0,0) - 175 * 24 * 60 * 60 * 1000)}
              endDate={new Date(new Date().setHours(0,0,0,0))}
              rectSize={10}
              space={2}
              rectRender={(props, data) => {
                if (!data.count) {
                  return (
                    <rect {...props} rx="2.5" ry="2.5" fill="rgba(255,255,255,0.03)" />
                  );
                }
                
                // 增强的绿色渐变：从暗到亮，对比度更高
                const value = data.count || 0;
                let fillColor = 'rgba(255,255,255,0.03)';
                
                if (value > 240) {
                  fillColor = '#39d353'; // Neon Green
                } else if (value > 180) {
                  fillColor = '#26a641';
                } else if (value > 120) {
                  fillColor = '#006d32';
                } else if (value > 60) {
                  fillColor = '#0e4429'; 
                } else if (value > 0) {
                  fillColor = '#0e4429'; // Base level
                }
                
                return (
                  <rect
                    {...props}
                    rx="2.5"
                    ry="2.5"
                    fill={fillColor}
                    className={value > 180 ? 'transition-all duration-200 hover:opacity-80' : ''}
                  />
                );
              }}
            />
          </div>
        </section>
      </main>

      {/* Custom Date Picker Modal */}
      {showDatePicker && (() => {
        // 计算日期范围是否超过3个月（90天）
        const isRangeValid = () => {
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 90;
        };

        const rangeValid = isRangeValid();
        const canConfirm = customStartDate && customEndDate && rangeValid;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDatePicker(false)}
          >
            <div 
              className="bg-[#0F172A] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm m-0 sm:m-4 transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">选择时间范围</h3>
                <p className="text-xs text-gray-400 mt-1">选择开始和结束日期（最多3个月）</p>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">开始日期</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">结束日期</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Error Message */}
              {customStartDate && customEndDate && !rangeValid && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-xs text-red-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    时间范围不能超过3个月（90天）
                  </p>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (canConfirm) {
                      setShowDatePicker(false);
                      fetchAnalytics();
                    }
                  }}
                  disabled={!canConfirm}
                  className="flex-1 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AnalyticsView;