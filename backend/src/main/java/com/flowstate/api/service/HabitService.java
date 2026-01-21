package com.flowstate.api.service;

import com.flowstate.api.dto.HabitRequest;
import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.HabitLog;
import com.flowstate.api.entity.User;
import com.flowstate.api.enums.Frequency;
import com.flowstate.api.enums.GoalType;
import com.flowstate.api.repository.HabitLogRepository;
import com.flowstate.api.repository.HabitRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    public HabitService(HabitRepository habitRepository, HabitLogRepository habitLogRepository,
                        UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<HabitResponse> getHabitsForDate(UUID userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Habit> habits = habitRepository.findByUserAndIsActiveTrue(user);
        return habits.stream()
                .map(h -> mapToResponse(h, date))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HabitResponse> getTodayHabits(UUID userId) {
        return getHabitsForDate(userId, LocalDate.now());
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(HabitService.class);

    @Transactional
    public HabitResponse createHabit(UUID userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String habitName = request.getName() != null ? request.getName().trim() : "";
        if (habitName.isEmpty()) {
            throw new RuntimeException("习惯名称不能为空");
        }

        if (habitRepository.existsByUserAndNameIgnoreCaseAndIsActiveTrue(user, habitName)) {
            log.warn("Duplicate habit name detected for user {}: {}", userId, habitName);
            throw new RuntimeException("同名习惯已存在");
        }

        Habit habit = Habit.builder()
                .user(user)
                .name(habitName)
                .category(request.getCategory() != null ? request.getCategory() : "通用")
                .goalType(request.getGoalType() != null ? request.getGoalType() : GoalType.QUANTITATIVE)
                .frequency(request.getFrequency() != null ? request.getFrequency() : Frequency.DAILY)
                .goalValue(request.getGoalValue() != null ? request.getGoalValue() : 1)
                .unit(request.getUnit() != null ? request.getUnit() : "次")
                .icon(request.getIcon() != null ? request.getIcon() : "check_circle")
                .color(request.getColor() != null ? request.getColor() : "bg-primary")
                .isActive(true)
                .build();

        Habit savedHabit = habitRepository.save(habit);
        return mapToResponse(savedHabit, LocalDate.now());
    }

    @Transactional
    public HabitResponse logHabit(UUID habitId, Integer increment) {
        System.out.println("[DEBUG] HabitService: Logging habit " + habitId + " with increment " + increment);
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        LocalDate today = LocalDate.now();
        HabitLog log = habitLogRepository.findByHabitAndDate(habit, today)
                .orElseGet(() -> HabitLog.builder()
                        .habit(habit)
                        .date(today)
                        .currentValue(0)
                        .isCompleted(false)
                        .build());

        log.setCurrentValue(log.getCurrentValue() + increment);

        // 判定完成逻辑
        if (log.getCurrentValue() >= habit.getGoalValue()) {
            log.setIsCompleted(true);
        } else {
            log.setIsCompleted(false);
        }

        habitLogRepository.save(log);

        // 同步更新 habit 对象的 logs 集合，确保 mapToResponse 能够正确计算当前值
        if (habit.getLogs() != null) {
            if (!habit.getLogs().contains(log)) {
                habit.getLogs().add(log);
            }
        }

        return mapToResponse(habit, LocalDate.now());
    }

    private HabitResponse mapToResponse(Habit habit, LocalDate date) {
        int currentValue = 0;

        if (habit.getLogs() != null) {
            if (habit.getFrequency() == Frequency.DAILY) {
                currentValue = habit.getLogs().stream()
                        .filter(log -> log.getDate().isEqual(date))
                        .mapToInt(HabitLog::getCurrentValue)
                        .sum();
            } else if (habit.getFrequency() == Frequency.WEEKLY) {
                java.time.temporal.WeekFields weekFields = java.time.temporal.WeekFields.of(java.util.Locale.getDefault());
                int targetWeek = date.get(weekFields.weekOfWeekBasedYear());
                int targetYear = date.get(weekFields.weekBasedYear());

                currentValue = habit.getLogs().stream()
                        .filter(log -> {
                            int logWeek = log.getDate().get(weekFields.weekOfWeekBasedYear());
                            int logYear = log.getDate().get(weekFields.weekBasedYear());
                            return logWeek == targetWeek && logYear == targetYear;
                        })
                        .mapToInt(HabitLog::getCurrentValue)
                        .sum();
            } else if (habit.getFrequency() == Frequency.MONTHLY) {
                currentValue = habit.getLogs().stream()
                        .filter(log -> log.getDate().getYear() == date.getYear() &&
                                log.getDate().getMonth() == date.getMonth())
                        .mapToInt(HabitLog::getCurrentValue)
                        .sum();
            }
        }

        boolean isCompleted = currentValue >= habit.getGoalValue();

        return HabitResponse.builder()
                .id(habit.getId())
                .name(habit.getName())
                .category(habit.getCategory())
                .goalType(habit.getGoalType())
                .frequency(habit.getFrequency())
                .goalValue(habit.getGoalValue())
                .unit(habit.getUnit())
                .icon(habit.getIcon())
                .color(habit.getColor())
                .currentValue(currentValue)
                .isCompleted(isCompleted)
                .currentStreak(calculateCurrentStreak(habit))
                .lastSevenDays(getLastSevenDaysStatus(habit))
                .build();
    }

    private Integer calculateCurrentStreak(Habit habit) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // 获取所有完成的记录，按日期倒序
        List<HabitLog> completedLogs = habitLogRepository.findByHabitAndDateAfterOrderByDateDesc(habit,
                        today.minusMonths(12)) // 追溯过去一年
                .stream()
                .filter(HabitLog::getIsCompleted)
                .collect(Collectors.toList());

        if (completedLogs.isEmpty()) {
            return 0;
        }

        // 检查最近一天是否是今天或昨天。如果最后一次完成是在昨天之前，Streak 已断。
        LocalDate lastCompletedDate = completedLogs.get(0).getDate();
        if (!lastCompletedDate.isEqual(today) && !lastCompletedDate.isEqual(yesterday)) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = lastCompletedDate;

        for (HabitLog log : completedLogs) {
            if (log.getDate().isEqual(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }

    private List<Boolean> getLastSevenDaysStatus(Habit habit) {
        LocalDate today = LocalDate.now();
        // 生成从 6 天前到今天的映射
        List<LocalDate> dateRange = IntStream.rangeClosed(0, 6)
                .mapToObj(i -> today.minusDays(6 - i))
                .collect(Collectors.toList());

        List<HabitLog> recentLogs = habitLogRepository.findByHabitAndDateAfterOrderByDateDesc(habit,
                today.minusDays(7));

        return dateRange.stream().map(date -> {
            return recentLogs.stream()
                    .filter(log -> log.getDate().isEqual(date))
                    .findFirst()
                    .map(HabitLog::getIsCompleted)
                    .orElse(false);
        }).collect(Collectors.toList());
    }

    @Transactional
    public void seedHistory(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Habit> habits = habitRepository.findByUserAndIsActiveTrue(user);
        LocalDate today = LocalDate.now();
        java.util.Random random = new java.util.Random();

        for (Habit habit : habits) {
            // Generate logs for past 30 days
            for (int i = 1; i <= 30; i++) {
                LocalDate pastDate = today.minusDays(i);
                // 70% chance to have some activity, 30% chance of nothing
                if (random.nextDouble() > 0.3) {
                    // Random value between 0 and goal * 1.5
                    int val = random.nextInt((int) (habit.getGoalValue() * 1.5) + 1);
                    if (val > 0) {
                        HabitLog log = HabitLog.builder()
                                .habit(habit)
                                .date(pastDate)
                                .currentValue(val)
                                .isCompleted(val >= habit.getGoalValue())
                                .build();
                        habitLogRepository.save(log);
                    }
                }
            }
        }
    }
}
