package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.dto.JobRequest;
import com.example.hiringsystem.dto.JobResponse;
import com.example.hiringsystem.exception.InvalidCredentialsException;
import com.example.hiringsystem.exception.ResourceNotFoundException;
import com.example.hiringsystem.model.Job;
import com.example.hiringsystem.model.JobStatus;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.repository.JobRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public JobResponse createJob(JobRequest request, Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + recruiterId));

        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new InvalidCredentialsException("Only recruiters or admins can create jobs");
        }

        Job job = Job.builder()
                .title(request.getTitle() != null ? request.getTitle() : "Untitled Job")
                .description(request.getDescription() != null ? request.getDescription() : "")
                .location(request.getLocation() != null ? request.getLocation() : "Remote")
                .status(JobStatus.OPEN)
                .createdBy(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    @Override
    public List<JobResponse> getAllOpenJobs() {
        return jobRepository.findByStatus(JobStatus.OPEN).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JobResponse closeJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getRole() != Role.ADMIN && !job.getCreatedBy().getId().equals(userId)) {
            throw new InvalidCredentialsException("Not authorized to close this job");
        }

        job.setStatus(JobStatus.CLOSED);
        Job updatedJob = jobRepository.save(job);
        return mapToResponse(updatedJob);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long jobId, JobRequest request, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getRole() != Role.ADMIN && !job.getCreatedBy().getId().equals(userId)) {
            throw new InvalidCredentialsException("Not authorized to update this job");
        }

        job.setTitle(request.getTitle() != null ? request.getTitle() : job.getTitle());
        job.setDescription(request.getDescription() != null ? request.getDescription() : job.getDescription());
        job.setLocation(request.getLocation() != null ? request.getLocation() : job.getLocation());

        Job updatedJob = jobRepository.save(job);
        return mapToResponse(updatedJob);
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .recruiterName(job.getCreatedBy().getUsername())
                .recruiterId(job.getCreatedBy().getId())
                .build();
    }
}
