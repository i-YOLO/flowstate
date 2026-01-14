package com.flowstate.api.service;

import com.flowstate.api.dto.TimeRecordRequest;
import com.flowstate.api.dto.TimeRecordResponse;
import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.TimeRecord;
import com.flowstate.api.entity.User;
import com.flowstate.api.repository.HabitRepository;
import com.flowstate.api.repository.TimeRecordRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TimeRecordService {

    private final TimeRecordRepository timeRecordRepository;
    private final UserRepository userRepository;
    private final HabitRepository habitRepository;

    public TimeRecordService(TimeRecordRepository timeRecordRepository, UserRepository userRepository,
            HabitRepository habitRepository) {
        this.timeRecordRepository = timeRecordRepository;
        this.userRepository = userRepository;
        this.habitRepository = habitRepository;
    }

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getRecordsForUser(UUID userId) {
        return timeRecordRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TimeRecordResponse createRecord(UUID userId, TimeRecordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Habit habit = null;
        if (request.getHabitId() != null) {
            habit = habitRepository.findById(request.getHabitId())
                    .orElse(null);
        }

        TimeRecord record = TimeRecord.builder()
                .user(user)
                .habit(habit)
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .startTime(request.getStartTime())
                .duration(request.getDuration())
                .category(request.getCategory())
                .color(request.getColor())
                .build();

        TimeRecord saved = timeRecordRepository.save(record);
        return mapToResponse(saved);
    }

    @Transactional
    public TimeRecordResponse updateRecord(UUID recordId, TimeRecordRequest request) {
        TimeRecord record = timeRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("TimeRecord not found"));

        Habit habit = null;
        if (request.getHabitId() != null) {
            habit = habitRepository.findById(request.getHabitId())
                    .orElse(null);
        }

        record.setTitle(request.getTitle());
        record.setSubtitle(request.getSubtitle());
        record.setStartTime(request.getStartTime());
        record.setDuration(request.getDuration());
        record.setCategory(request.getCategory());
        record.setColor(request.getColor());
        record.setHabit(habit);

        TimeRecord updated = timeRecordRepository.save(record);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteRecord(UUID recordId) {
        timeRecordRepository.deleteById(recordId);
    }

    private TimeRecordResponse mapToResponse(TimeRecord record) {
        return TimeRecordResponse.builder()
                .id(record.getId())
                .title(record.getTitle())
                .subtitle(record.getSubtitle())
                .startTime(record.getStartTime())
                .duration(record.getDuration())
                .category(record.getCategory())
                .color(record.getColor())
                .habitId(record.getHabit() != null ? record.getHabit().getId() : null)
                .createdAt(record.getCreatedAt())
                .build();
    }
}
