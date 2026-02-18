package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.JobRequest;
import com.example.hiringsystem.dto.JobResponse;

import java.util.List;

public interface JobService {
    JobResponse createJob(JobRequest request, Long recruiterId);

    List<JobResponse> getAllOpenJobs();

    JobResponse closeJob(Long jobId, Long userId);

    JobResponse updateJob(Long jobId, JobRequest request, Long userId);
}
