package com.flowstate.api.repository;

import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.HabitLog;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, UUID> {
    Optional<HabitLog> findByHabitAndDate(Habit habit, LocalDate date);
    java.util.List<HabitLog> findByHabitAndDateAfterOrderByDateDesc(Habit habit, LocalDate date);
    
    // Analytics: 按日期范围查询
    List<HabitLog> findByHabit_UserAndDateBetween(User user, LocalDate start, LocalDate end);
    
    // Analytics: 按日期统计完成情况
    @Query("SELECT l.date as date, COUNT(DISTINCT l.habit.id) as totalHabits, " +
           "SUM(CASE WHEN l.isCompleted = true THEN 1 ELSE 0 END) as completedHabits " +
           "FROM HabitLog l WHERE l.habit.user = :user AND l.date >= :start AND l.date <= :end " +
           "GROUP BY l.date ORDER BY l.date")
    List<DailyHabitStats> getDailyStats(@Param("user") User user, 
                                         @Param("start") LocalDate start, 
                                         @Param("end") LocalDate end);
    
    // Analytics: 全年热力图数据
    @Query("SELECT l.date as date, " +
           "SUM(CASE WHEN l.isCompleted = true THEN 1 ELSE 0 END) as completedCount, " +
           "COUNT(DISTINCT l.habit.id) as totalCount " +
           "FROM HabitLog l WHERE l.habit.user = :user " +
           "AND EXTRACT(YEAR FROM l.date) = :year " +
           "GROUP BY l.date ORDER BY l.date")
    List<HeatmapDataProjection> getYearlyHeatmapData(@Param("user") User user, @Param("year") Integer year);

    // Analytics: 指定日期范围的热力图数据
    @Query("SELECT l.date as date, " +
           "SUM(CASE WHEN l.isCompleted = true THEN 1 ELSE 0 END) as completedCount, " +
           "COUNT(DISTINCT l.habit.id) as totalCount " +
           "FROM HabitLog l WHERE l.habit.user = :user " +
           "AND l.date >= :startDate AND l.date <= :endDate " +
           "GROUP BY l.date ORDER BY l.date")
    List<HeatmapDataProjection> getHeatmapDataByRange(@Param("user") User user, 
                                                      @Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);
    
    interface DailyHabitStats {
        LocalDate getDate();
        Long getTotalHabits();
        Long getCompletedHabits();
    }
    
    interface HeatmapDataProjection {
        LocalDate getDate();
        Long getCompletedCount();
        Long getTotalCount();
    }
}
