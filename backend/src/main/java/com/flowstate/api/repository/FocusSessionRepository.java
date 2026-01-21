package com.flowstate.api.repository;

import com.flowstate.api.entity.FocusSession;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, UUID> {
    List<FocusSession> findByUserOrderByStartTimeDesc(User user);

    List<FocusSession> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
    
    // Analytics: 按分类聚合时长
    @Query("SELECT f.category.name as category, SUM(f.duration) as totalMinutes " +
           "FROM FocusSession f WHERE f.user = :user " +
           "AND FUNCTION('DATE', f.startTime) >= :start AND FUNCTION('DATE', f.startTime) <= :end " +
           "GROUP BY f.category.name")
    List<CategoryTimeProjection> sumDurationByCategory(@Param("user") User user, 
                                                        @Param("start") LocalDate start, 
                                                        @Param("end") LocalDate end);
    
    // Analytics: 按日期和分类聚合（用于折线图）
    @Query("SELECT FUNCTION('DATE', f.startTime) as date, f.category.name as category, SUM(f.duration) as totalMinutes " +
           "FROM FocusSession f WHERE f.user = :user " +
           "AND FUNCTION('DATE', f.startTime) >= :start AND FUNCTION('DATE', f.startTime) <= :end " +
           "GROUP BY FUNCTION('DATE', f.startTime), f.category.name ORDER BY FUNCTION('DATE', f.startTime)")
    List<DailyCategoryTimeProjection> sumDurationByDateAndCategory(@Param("user") User user, 
                                                                     @Param("start") LocalDate start, 
                                                                     @Param("end") LocalDate end);
    
    interface CategoryTimeProjection {
        String getCategory();
        Long getTotalMinutes();
    }
    
    interface DailyCategoryTimeProjection {
        LocalDate getDate();
        String getCategory();
        Long getTotalMinutes();
    }
}
