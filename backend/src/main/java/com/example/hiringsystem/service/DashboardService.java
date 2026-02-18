package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getRecruiterDashboardStats(Long recruiterId);
}
