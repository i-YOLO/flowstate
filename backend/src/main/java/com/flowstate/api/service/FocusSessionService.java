package com.flowstate.api.service;

import com.flowstate.api.dto.FocusSessionRequest;
import com.flowstate.api.dto.FocusSessionResponse;
import com.flowstate.api.dto.FocusTodayStatsDTO;
import com.flowstate.api.entity.Category;
import com.flowstate.api.entity.FocusSession;
import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.TimeRecord;
import com.flowstate.api.entity.User;
import com.flowstate.api.repository.CategoryRepository;
import com.flowstate.api.repository.FocusSessionRepository;
import com.flowstate.api.repository.HabitRepository;
import com.flowstate.api.repository.TimeRecordRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final HabitRepository habitRepository;
    private final TimeRecordRepository timeRecordRepository;

    public FocusSessionService(FocusSessionRepository focusSessionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            HabitRepository habitRepository,
            TimeRecordRepository timeRecordRepository) {
        this.focusSessionRepository = focusSessionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.habitRepository = habitRepository;
        this.timeRecordRepository = timeRecordRepository;
    }

    @Transactional
    public FocusSessionResponse createSession(UUID userId, FocusSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Habit habit = null;
        if (request.getHabitId() != null) {
            habit = habitRepository.findById(request.getHabitId()).orElse(null);
        }

        FocusSession session = FocusSession.builder()
                .user(user)
                .category(category)
                .habit(habit)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .duration(request.getDuration())
                .status(request.getStatus())
                .build();

        FocusSession savedSession = focusSessionRepository.save(session);

        // 如果专注完成且时长至少为 1 分钟，自动归档到时间轴 (TimeRecord)
        if ("COMPLETED".equals(request.getStatus()) && request.getDuration() != null && request.getDuration() > 0) {
            syncToTimeRecord(savedSession);
        }

        return mapToResponse(savedSession);
    }

    @Transactional(readOnly = true)
    public List<FocusSessionResponse> getUserSessions(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return focusSessionRepository.findByUserOrderByStartTimeDesc(user).stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FocusTodayStatsDTO getTodayStats(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        List<FocusSession> todaySessions = focusSessionRepository.findByUserAndStartTimeBetween(user, startOfDay,
                endOfDay);

        int totalMinutes = todaySessions.stream()
                .filter(s -> s.getDuration() != null)
                .mapToInt(FocusSession::getDuration)
                .sum();

        int completedSessions = (int) todaySessions.stream()
                .filter(s -> "COMPLETED".equals(s.getStatus()))
                .count();

        return new FocusTodayStatsDTO(totalMinutes, completedSessions);
    }

    private FocusSessionResponse mapToResponse(FocusSession session) {
        FocusSessionResponse response = new FocusSessionResponse();
        response.setId(session.getId());
        response.setUserId(session.getUser().getId());
        response.setCategoryId(session.getCategory() != null ? session.getCategory().getId() : null);
        response.setCategoryName(session.getCategory() != null ? session.getCategory().getName() : null);
        response.setCategoryColor(session.getCategory() != null ? session.getCategory().getColor() : null);
        response.setHabitId(session.getHabit() != null ? session.getHabit().getId() : null);
        response.setHabitName(session.getHabit() != null ? session.getHabit().getName() : null);
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setDuration(session.getDuration());
        response.setStatus(session.getStatus());
        response.setCreatedAt(session.getCreatedAt());
        return response;
    }

    private void syncToTimeRecord(FocusSession session) {
        // 计算在当日时间轴中的开始分钟数 (从凌晨 00:00 开始)
        int startMinutes = session.getStartTime().getHour() * 60 + session.getStartTime().getMinute();

        String title = session.getHabit() != null ? "专注: " + session.getHabit().getName() : "深度专注";
        String categoryName = session.getCategory() != null ? session.getCategory().getName() : "工作";
        String color = session.getCategory() != null ? session.getCategory().getColor() : "indigo";

        TimeRecord record = TimeRecord.builder()
                .user(session.getUser())
                .habit(session.getHabit())
                .title(title)
                .subtitle("通过专注模式自动记录")
                .startTime(startMinutes)
                .duration(session.getDuration())
                .category(categoryName)
                .color(color)
                .build();

        timeRecordRepository.save(record);
    }
}
