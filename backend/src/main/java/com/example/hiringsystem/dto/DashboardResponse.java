package com.example.hiringsystem.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalJobs;
    private long activeApplications;
    private long scheduledInterviews;
    private long completedEvaluations;
    private Map<String, Long> applicationsByStatus;
}
