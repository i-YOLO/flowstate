package com.flowstate.api.service;

import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.HabitLog;
import com.flowstate.api.entity.User;
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

        public List<HabitResponse> getTodayHabits(UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Habit> habits = habitRepository.findByUserAndIsActiveTrue(user);
                LocalDate today = LocalDate.now();

                return habits.stream().map(habit -> {
                        HabitLog log = habitLogRepository.findByHabitAndDate(habit, today)
                                        .orElseGet(() -> HabitLog.builder()
                                                        .habit(habit)
                                                        .date(today)
                                                        .currentValue(0)
                                                        .isCompleted(false)
                                                        .build());

                        return HabitResponse.builder()
                                        .id(habit.getId())
                                        .name(habit.getName())
                                        .category(habit.getCategory())
                                        .goalType(habit.getGoalType())
                                        .goalValue(habit.getGoalValue())
                                        .unit(habit.getUnit())
                                        .icon(habit.getIcon())
                                        .color(habit.getColor())
                                        .currentValue(log.getCurrentValue())
                                        .isCompleted(log.getIsCompleted())
                                        .build();
                }).collect(Collectors.toList());
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

                return HabitResponse.builder()
                                .id(habit.getId())
                                .name(habit.getName())
                                .currentValue(log.getCurrentValue())
                                .isCompleted(log.getIsCompleted())
                                .build();
        }
}
