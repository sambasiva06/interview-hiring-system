package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.DashboardResponse;
import com.example.hiringsystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/recruiter-stats")
    public ResponseEntity<DashboardResponse> getRecruiterStats(@RequestParam Long recruiterId) {
        return ResponseEntity.ok(dashboardService.getRecruiterDashboardStats(recruiterId));
    }
}
