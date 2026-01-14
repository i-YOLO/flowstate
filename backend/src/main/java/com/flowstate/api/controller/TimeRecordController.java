package com.flowstate.api.controller;

import com.flowstate.api.dto.TimeRecordRequest;
import com.flowstate.api.dto.TimeRecordResponse;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.TimeRecordService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-records")
@CrossOrigin(origins = "*")
public class TimeRecordController {

    private final TimeRecordService timeRecordService;

    public TimeRecordController(TimeRecordService timeRecordService) {
        this.timeRecordService = timeRecordService;
    }

    @GetMapping
    public List<TimeRecordResponse> getMyRecords(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return timeRecordService.getRecordsForUser(userDetails.getId());
    }

    @PostMapping
    public TimeRecordResponse createRecord(Authentication authentication, @RequestBody TimeRecordRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return timeRecordService.createRecord(userDetails.getId(), request);
    }

    @PutMapping("/{id}")
    public TimeRecordResponse updateRecord(@PathVariable UUID id, @RequestBody TimeRecordRequest request) {
        return timeRecordService.updateRecord(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable UUID id) {
        timeRecordService.deleteRecord(id);
    }
}
