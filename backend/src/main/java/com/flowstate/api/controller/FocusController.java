package com.flowstate.api.controller;

import com.flowstate.api.dto.FocusSessionRequest;
import com.flowstate.api.dto.FocusSessionResponse;
import com.flowstate.api.dto.FocusTodayStatsDTO;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.FocusSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/focus")
public class FocusController {

    private final FocusSessionService focusSessionService;

    public FocusController(FocusSessionService focusSessionService) {
        this.focusSessionService = focusSessionService;
    }

    @PostMapping("/sessions")
    public ResponseEntity<FocusSessionResponse> createSession(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody FocusSessionRequest request) {
        FocusSessionResponse session = focusSessionService.createSession(userDetails.getId(), request);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<FocusSessionResponse>> getSessions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<FocusSessionResponse> sessions = focusSessionService.getUserSessions(userDetails.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/today-stats")
    public ResponseEntity<FocusTodayStatsDTO> getTodayStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FocusTodayStatsDTO stats = focusSessionService.getTodayStats(userDetails.getId());
        return ResponseEntity.ok(stats);
    }
}
