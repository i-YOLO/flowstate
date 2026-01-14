package com.flowstate.api.controller;

import com.flowstate.api.dto.HabitRequest;
import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.HabitService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*") // 允许前端容器跨域
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/today")
    public List<HabitResponse> getTodayHabits(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return habitService.getTodayHabits(userDetails.getId());
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
}
