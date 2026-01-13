package com.flowstate.api.service;

import com.flowstate.api.entity.Habit;
import com.flowstate.api.entity.User;
import com.flowstate.api.enums.GoalType;
import com.flowstate.api.repository.HabitRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DataSeedListener {

    private final UserRepository userRepository;
    private final HabitRepository habitRepository;

    public DataSeedListener(UserRepository userRepository, HabitRepository habitRepository) {
        this.userRepository = userRepository;
        this.habitRepository = habitRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedData() {
        if (userRepository.count() == 0) {
            User demoUser = User.builder()
                    .email("demo@flowstate.com")
                    .passwordHash("hashed_password")
                    .name("Demo User")
                    .bio("Enjoying the flow state.")
                    .build();
            userRepository.save(demoUser);

            habitRepository.save(Habit.builder()
                    .user(demoUser)
                    .name("Deep Work")
                    .category("Work")
                    .goalType(GoalType.DURATION)
                    .goalValue(240)
                    .unit("min")
                    .icon("💻")
                    .color("#6366f1")
                    .build());

            habitRepository.save(Habit.builder()
                    .user(demoUser)
                    .name("Drink Water")
                    .category("Health")
                    .goalType(GoalType.QUANTITATIVE)
                    .goalValue(2000)
                    .unit("ml")
                    .icon("💧")
                    .color("#3b82f6")
                    .build());

            System.out.println("SEED DATA: Created Demo User with ID: " + demoUser.getId());
        }
    }
}
