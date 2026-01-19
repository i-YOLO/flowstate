package com.flowstate.api.controller;

import com.flowstate.api.dto.HabitRequest;
import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.HabitService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*") // 允许前端容器跨域
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/today")
    public List<HabitResponse> getTodayHabits(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return habitService.getHabitsForDate(userDetails.getId(), queryDate);
    }

    @PostMapping("/{habitId}/log")
    public HabitResponse logHabit(
            @PathVariable UUID habitId,
            @RequestParam(defaultValue = "1") Integer increment) {
        return habitService.logHabit(habitId, increment);
    }

    @PostMapping
    public HabitResponse createHabit(Authentication authentication, @RequestBody HabitRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return habitService.createHabit(userDetails.getId(), request);
    }

    @PostMapping("/seed")
    public void seedHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        habitService.seedHistory(userDetails.getId());
    }
}
