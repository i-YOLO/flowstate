package com.flowstate.api.repository;

import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HabitRepository extends JpaRepository<Habit, UUID> {
    List<Habit> findByUserAndIsActiveTrue(User user);

    List<Habit> findByUserId(UUID userId);

    boolean existsByUserAndNameIgnoreCaseAndIsActiveTrue(User user, String name);
}
