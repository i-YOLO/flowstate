package com.flowstate.api.repository;

import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, UUID> {
    Optional<HabitLog> findByHabitAndDate(Habit habit, LocalDate date);
    java.util.List<HabitLog> findByHabitAndDateAfterOrderByDateDesc(Habit habit, LocalDate date);
}
