package com.flowstate.api.controller;

import com.flowstate.api.dto.HabitResponse;
import com.flowstate.api.service.HabitService;
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

    @GetMapping("/today/{userId}")
    public List<HabitResponse> getTodayHabits(@PathVariable UUID userId) {
        return habitService.getTodayHabits(userId);
    }

    @PostMapping("/{habitId}/log")
    public HabitResponse logHabit(
            @PathVariable UUID habitId,
            @RequestParam(defaultValue = "1") Integer increment) {
        return habitService.logHabit(habitId, increment);
    }
}
