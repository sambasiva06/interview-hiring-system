package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.dto.DashboardResponse;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.*;
import com.example.hiringsystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    @Override
    public DashboardResponse getRecruiterDashboardStats(Long recruiterId) {
        long totalJobs = jobRepository.countByCreatedById(recruiterId);

        long activeApps = applicationRepository.findAll().stream()
                .filter(a -> a.getJob().getCreatedBy().getId().equals(recruiterId))
                .filter(a -> a.getStatus() != ApplicationStatus.REJECTED && a.getStatus() != ApplicationStatus.SELECTED
                        && a.getStatus() != ApplicationStatus.WITHDRAWN)
                .count();

        long scheduledInterviews = interviewRepository.findAll().stream()
                .filter(i -> i.getApplication().getJob().getCreatedBy().getId().equals(recruiterId))
                .filter(i -> i.getStatus() == InterviewStatus.SCHEDULED)
                .count();

        var statusMap = applicationRepository.findAll().stream()
                .filter(a -> a.getJob().getCreatedBy().getId().equals(recruiterId))
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));

        return DashboardResponse.builder()
                .totalJobs(totalJobs)
                .activeApplications(activeApps)
                .scheduledInterviews(scheduledInterviews)
                .applicationsByStatus(statusMap)
                .build();
    }
}
