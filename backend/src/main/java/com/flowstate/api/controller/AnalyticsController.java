package com.flowstate.api.controller;

import com.flowstate.api.dto.AchievementDTO;
import com.flowstate.api.dto.HabitConsistencyDTO;
import com.flowstate.api.dto.HabitHeatmapDTO;
import com.flowstate.api.dto.TimeAllocationDTO;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/time-allocation")
    public TimeAllocationDTO getTimeAllocation(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return analyticsService.getTimeAllocation(userDetails.getId(), startDate, endDate);
    }

    @GetMapping("/habit-consistency")
    public HabitConsistencyDTO getHabitConsistency(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return analyticsService.getHabitConsistency(userDetails.getId(), startDate, endDate);
    }

    @GetMapping("/habit-heatmap")
    public HabitHeatmapDTO getHabitHeatmap(
            Authentication authentication,
            @RequestParam(defaultValue = "2026") Integer year) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return analyticsService.getHabitHeatmap(userDetails.getId(), year);
    }

    @GetMapping("/achievements")
    public AchievementDTO getAchievements(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return analyticsService.getAchievements(userDetails.getId(), startDate, endDate);
    }

    // 添加 heatmap 接口别名以匹配前端调用
    @GetMapping("/heatmap")
    public HabitHeatmapDTO getHeatmap(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "2026") Integer year) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (startDate != null && endDate != null) {
            return analyticsService.getHabitHeatmap(userDetails.getId(), startDate, endDate);
        }
        
        return analyticsService.getHabitHeatmap(userDetails.getId(), year);
    }
}
