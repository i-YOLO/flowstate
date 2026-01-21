package com.flowstate.api.repository;

import com.flowstate.api.entity.TimeRecord;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TimeRecordRepository extends JpaRepository<TimeRecord, UUID> {
    List<TimeRecord> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    List<TimeRecord> findByUserId(UUID userId);

    List<TimeRecord> findByUserIdAndRecordDate(UUID userId, LocalDate recordDate);
    public interface CategoryTimeProjection {
        String getCategory();
        Long getTotalMinutes();
    }

    public interface DailyCategoryTimeProjection {
        LocalDate getDate();
        String getCategory();
        Long getTotalMinutes();
    }

    @Query("SELECT t.category as category, SUM(t.duration) as totalMinutes " +
           "FROM TimeRecord t WHERE t.user = :user " +
           "AND t.recordDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category")
    List<CategoryTimeProjection> sumDurationByCategory(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT t.recordDate as date, t.category as category, SUM(t.duration) as totalMinutes " +
           "FROM TimeRecord t WHERE t.user = :user " +
           "AND t.recordDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.recordDate, t.category")
    List<DailyCategoryTimeProjection> sumDurationByDateAndCategory(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
