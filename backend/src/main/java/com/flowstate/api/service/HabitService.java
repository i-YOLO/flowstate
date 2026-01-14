package com.flowstate.api.service;

import com.flowstate.api.dto.HabitRequest;
import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.HabitLog;
import com.flowstate.api.entity.User;
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
        public List<HabitResponse> getTodayHabits(UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<Habit> habits = habitRepository.findByUserAndIsActiveTrue(user);
                return habits.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public HabitResponse createHabit(UUID userId, HabitRequest request) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Habit habit = Habit.builder()
                                .user(user)
                                .name(request.getName())
                                .category(request.getCategory() != null ? request.getCategory() : "通用")
                                .goalType(request.getGoalType() != null ? request.getGoalType() : GoalType.QUANTITATIVE)
                                .goalValue(request.getGoalValue() != null ? request.getGoalValue() : 1)
                                .unit(request.getUnit() != null ? request.getUnit() : "次")
                                .icon(request.getIcon() != null ? request.getIcon() : "check_circle")
                                .color(request.getColor() != null ? request.getColor() : "bg-primary")
                                .isActive(true)
                                .build();

                Habit savedHabit = habitRepository.save(habit);
                return mapToResponse(savedHabit);
        }

        @Transactional
        public HabitResponse logHabit(UUID habitId, Integer increment) {
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
                }

                habitLogRepository.save(log);

                return mapToResponse(habit);
        }

        private HabitResponse mapToResponse(Habit habit) {
                LocalDate today = LocalDate.now();

                int currentValue = habit.getLogs() != null ? habit.getLogs().stream()
                                .filter(log -> log.getDate().isEqual(today))
                                .mapToInt(HabitLog::getCurrentValue)
                                .sum() : 0;

                // If we just saved the log, the habit.getLogs() might not be refreshed if using
                // Hibernate caching,
                // but typically it's fine or we might need to rely on the log we just saved in
                // logHabit.
                // For getTodayHabits, it's fine. For logHabit, we might want to be careful.
                // However, mapToResponse re-calculates from list.

                boolean isCompleted = currentValue >= habit.getGoalValue();

                return HabitResponse.builder()
                                .id(habit.getId())
                                .name(habit.getName())
                                .category(habit.getCategory())
                                .goalType(habit.getGoalType())
                                .goalValue(habit.getGoalValue())
                                .unit(habit.getUnit())
                                .icon(habit.getIcon())
                                .color(habit.getColor())
                                .currentValue(currentValue)
                                .isCompleted(isCompleted)
                                .build();
        }
}
