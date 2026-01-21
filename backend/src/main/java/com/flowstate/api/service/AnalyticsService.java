package com.flowstate.api.service;

import com.flowstate.api.dto.*;
import com.flowstate.api.entity.User;
import com.flowstate.api.repository.FocusSessionRepository;
import com.flowstate.api.repository.HabitLogRepository;
import com.flowstate.api.repository.TimeRecordRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private FocusSessionRepository focusSessionRepository;

    @Autowired
    private HabitLogRepository habitLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TimeRecordRepository timeRecordRepository;

    // 时间分配统计
    @Transactional(readOnly = true)
    public TimeAllocationDTO getTimeAllocation(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId).orElseThrow();

        // 查询分类时长 (使用 TimeRecord)
        List<TimeRecordRepository.CategoryTimeProjection> categoryData = 
            timeRecordRepository.sumDurationByCategory(user, startDate, endDate);

        // 计算总时长
        long totalMinutes = categoryData.stream()
            .mapToLong(TimeRecordRepository.CategoryTimeProjection::getTotalMinutes)
            .sum();

        // 构建分类列表
        List<TimeAllocationDTO.CategoryTime> categories = categoryData.stream()
            .map(c -> {
                TimeAllocationDTO.CategoryTime cat = new TimeAllocationDTO.CategoryTime();
                cat.setCategory(c.getCategory());
                cat.setDisplayName(c.getCategory()); // 简化版，直接使用分类名
                cat.setMinutes(c.getTotalMinutes());
                cat.setFormatted(formatMinutes(c.getTotalMinutes()));
                cat.setPercentage(totalMinutes > 0 ? (c.getTotalMinutes() * 100.0 / totalMinutes) : 0.0);
                return cat;
            })
            .collect(Collectors.toList());

        // 查询每日数据 (使用 TimeRecord)
        List<TimeRecordRepository.DailyCategoryTimeProjection> dailyCategoryData = 
            timeRecordRepository.sumDurationByDateAndCategory(user, startDate, endDate);

        Map<LocalDate, Map<String, Long>> dailyMap = new HashMap<>();
        for (TimeRecordRepository.DailyCategoryTimeProjection d : dailyCategoryData) {
            dailyMap.computeIfAbsent(d.getDate(), k -> new HashMap<>())
                    .put(d.getCategory(), d.getTotalMinutes());
        }

        List<TimeAllocationDTO.DailyTime> dailyData = dailyMap.entrySet().stream()
            .map(entry -> {
                TimeAllocationDTO.DailyTime dt = new TimeAllocationDTO.DailyTime();
                dt.setDate(entry.getKey());
                dt.setCategoryMinutes(entry.getValue());
                dt.setTotalMinutes(entry.getValue().values().stream().mapToLong(Long::longValue).sum());
                return dt;
            })
            .sorted(Comparator.comparing(TimeAllocationDTO.DailyTime::getDate))
            .collect(Collectors.toList());

        // 计算环比增长（简化版，暂时返回 "N/A"）
        String comparison = "数据统计中";

        TimeAllocationDTO result = new TimeAllocationDTO();
        result.setTotalFocus(formatMinutes(totalMinutes));
        result.setComparison(comparison);
        result.setCategories(categories);
        result.setDailyData(dailyData);

        return result;
    }

    // 习惯一致性统计
    @Transactional(readOnly = true)
    public HabitConsistencyDTO getHabitConsistency(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId).orElseThrow();

        List<HabitLogRepository.DailyHabitStats> stats = 
            habitLogRepository.getDailyStats(user, startDate, endDate);

        List<HabitConsistencyDTO.DayData> dailyData = stats.stream()
            .map(s -> {
                HabitConsistencyDTO.DayData day = new HabitConsistencyDTO.DayData();
                day.setDate(s.getDate());
                day.setLabel(s.getDate().format(DateTimeFormatter.ofPattern("MM-dd")));
                day.setTotalHabits(s.getTotalHabits().intValue());
                day.setCompletedHabits(s.getCompletedHabits().intValue());
                double rate = s.getTotalHabits() > 0 ? 
                    (s.getCompletedHabits() * 100.0 / s.getTotalHabits()) : 0.0;
                day.setCompletionRate(rate);
                return day;
            })
            .collect(Collectors.toList());

        double avgRate = dailyData.stream()
            .mapToDouble(HabitConsistencyDTO.DayData::getCompletionRate)
            .average()
            .orElse(0.0);

        HabitConsistencyDTO result = new HabitConsistencyDTO();
        result.setAverageCompletionRate(avgRate);
        result.setDailyData(dailyData);

        return result;
    }

    // 习惯热力图数据
    @Transactional(readOnly = true)
    public HabitHeatmapDTO getHabitHeatmap(UUID userId, Integer year) {
        User user = userRepository.findById(userId).orElseThrow();

        List<HabitLogRepository.HeatmapDataProjection> data = 
            habitLogRepository.getYearlyHeatmapData(user, year);

        List<HabitHeatmapDTO.DayValue> dayValues = new ArrayList<>();
        
        if (data != null && !data.isEmpty()) {
            dayValues = data.stream()
                .filter(d -> d != null && d.getDate() != null)
                .map(d -> {
                    HabitHeatmapDTO.DayValue dv = new HabitHeatmapDTO.DayValue();
                    dv.setDate(d.getDate().toString());
                    
                    Long completedCount = d.getCompletedCount();
                    Long totalCount = d.getTotalCount();
                    
                    dv.setCount(completedCount != null ? completedCount.intValue() : 0);
                    
                    double completion = 0.0;
                    if (totalCount != null && totalCount > 0 && completedCount != null) {
                        completion = (completedCount * 100.0 / totalCount);
                    }
                    dv.setCompletion(completion);
                    
                    return dv;
                })
                .collect(Collectors.toList());
        }

        HabitHeatmapDTO result = new HabitHeatmapDTO();
        result.setYear(year);
        result.setData(dayValues);

        return result;
    }

    // 习惯热力图数据 (支持日期范围)
    @Transactional(readOnly = true)
    public HabitHeatmapDTO getHabitHeatmap(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId).orElseThrow();

        // 使用支持日期范围的新查询方法
        List<HabitLogRepository.HeatmapDataProjection> data = 
            habitLogRepository.getHeatmapDataByRange(user, startDate, endDate);

        List<HabitHeatmapDTO.DayValue> dayValues = new ArrayList<>();
        
        if (data != null && !data.isEmpty()) {
            dayValues = data.stream()
                .filter(d -> d != null && d.getDate() != null)
                .map(d -> {
                    HabitHeatmapDTO.DayValue dv = new HabitHeatmapDTO.DayValue();
                    dv.setDate(d.getDate().toString());
                    
                    Long completedCount = d.getCompletedCount();
                    Long totalCount = d.getTotalCount();
                    
                    dv.setCount(completedCount != null ? completedCount.intValue() : 0);
                    
                    double completion = 0.0;
                    if (totalCount != null && totalCount > 0 && completedCount != null) {
                        completion = (completedCount * 100.0 / totalCount);
                    }
                    dv.setCompletion(completion);
                    
                    return dv;
                })
                .collect(Collectors.toList());
        }

        HabitHeatmapDTO result = new HabitHeatmapDTO();
        result.setYear(null); // 范围查询时不特定于某一年
        result.setData(dayValues);

        return result;
    }

    // 成就总结
    @Transactional(readOnly = true)
    public AchievementDTO getAchievements(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId).orElseThrow();

        // 获取每日完成率
        List<HabitLogRepository.DailyHabitStats> stats = 
            habitLogRepository.getDailyStats(user, startDate, endDate);

        // 找出最佳表现日
        LocalDate bestDate = LocalDate.now();
        double bestRate = 0.0;

        for (HabitLogRepository.DailyHabitStats s : stats) {
            double rate = s.getTotalHabits() > 0 ? 
                (s.getCompletedHabits() * 100.0 / s.getTotalHabits()) : 0.0;
            if (rate > bestRate) {
                bestRate = rate;
                bestDate = s.getDate();
            }
        }

        // 查询最佳日的专注时长
        List<FocusSessionRepository.CategoryTimeProjection> focusData = 
            focusSessionRepository.sumDurationByCategory(user, bestDate, bestDate);
        
        long bestDayFocusMinutes = focusData.stream()
            .mapToLong(FocusSessionRepository.CategoryTimeProjection::getTotalMinutes)
            .sum();

        // 生成成就总结
        AchievementDTO result = new AchievementDTO();
        result.setBestDay(bestDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        result.setBestDate(bestDate);
        result.setCompletionRate(bestRate);
        result.setFocusHours(String.format("%.1f", bestDayFocusMinutes / 60.0));
        
        // 生产力指数（简化计算）
        int productivityScore = (int) Math.min(100, bestRate * 0.7 + (bestDayFocusMinutes / 60.0) * 3);
        result.setProductivityScore(productivityScore);
        
        result.setSummary(String.format("您保持了 %.0f%% 的任务完成率，并进行了 %.1f 小时的深度专注。",
            bestRate, bestDayFocusMinutes / 60.0));
        
        // 简化版统计
        result.setStreakDays(0L);
        result.setCompletedTasks(stats.stream().mapToInt(s -> s.getCompletedHabits().intValue()).sum());
        result.setTaskGrowth("N/A");

        return result;
    }

    // 辅助方法：格式化分钟数
    private String formatMinutes(long minutes) {
        if (minutes < 60) {
            return minutes + "min";
        } else {
            long hours = minutes / 60;
            long mins = minutes % 60;
            return mins > 0 ? hours + "h" + mins + "min" : hours + "h";
        }
    }
}
