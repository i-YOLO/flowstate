package com.flowstate.api.repository;

import com.flowstate.api.entity.TimeRecord;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TimeRecordRepository extends JpaRepository<TimeRecord, UUID> {
    List<TimeRecord> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    List<TimeRecord> findByUserId(UUID userId);

    List<TimeRecord> findByUserIdAndRecordDate(UUID userId, LocalDate recordDate);
}
