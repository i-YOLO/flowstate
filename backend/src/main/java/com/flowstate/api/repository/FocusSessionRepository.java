package com.flowstate.api.repository;

import com.flowstate.api.entity.FocusSession;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, UUID> {
    List<FocusSession> findByUserOrderByStartTimeDesc(User user);

    List<FocusSession> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}
