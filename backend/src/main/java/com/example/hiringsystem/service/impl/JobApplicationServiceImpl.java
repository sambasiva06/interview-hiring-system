package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.dto.ApplicationStatusHistoryResponse;
import com.example.hiringsystem.dto.JobApplicationResponse;
import com.example.hiringsystem.exception.DuplicateApplicationException;
import com.example.hiringsystem.exception.InvalidApplicationException;
import com.example.hiringsystem.exception.ResourceNotFoundException;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.ApplicationStatusHistoryRepository;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.repository.JobRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;

    @Override
    public JobApplicationResponse applyToJob(Long jobId, Long candidateId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + candidateId));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new InvalidApplicationException("Only candidates can apply for jobs.");
        }

        if (job.getStatus() != JobStatus.OPEN) {
            throw new InvalidApplicationException("Cannot apply to a closed job.");
        }

        if (job.getCreatedBy().getId().equals(candidateId)) {
            throw new InvalidApplicationException("Recruiters cannot apply to their own jobs.");
        }

        if (jobApplicationRepository.findByJobAndCandidate(job, candidate).isPresent()) {
            throw new DuplicateApplicationException("You have already applied for this job.");
        }

        JobApplication jobApplication = JobApplication.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .build();

        JobApplication saved = jobApplicationRepository.save(jobApplication);
        recordStatusHistory(saved, ApplicationStatus.APPLIED, "Initial application submitted.");

        return mapToResponse(saved);
    }

    @Override
    public List<JobApplicationResponse> getMyApplications(Long candidateId) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + candidateId));
        return jobApplicationRepository.findByCandidate(candidate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobApplicationResponse> getApplicationsForJob(Long jobId, Long requesterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requesterId));

        if (requester.getRole() != Role.ADMIN && !job.getCreatedBy().getId().equals(requesterId)) {
            throw new InvalidApplicationException("Unauthorized to view applications for this job.");
        }

        return jobApplicationRepository.findByJob(job).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void withdrawApplication(Long applicationId, Long candidateId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getCandidate().getId().equals(candidateId)) {
            throw new InvalidApplicationException("Unauthorized to withdraw this application.");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED
                || application.getStatus() == ApplicationStatus.REJECTED) {
            throw new InvalidApplicationException("Cannot withdraw an application that has already been processed.");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        jobApplicationRepository.save(application);
        recordStatusHistory(application, ApplicationStatus.WITHDRAWN, "Withdrawn by candidate.");
    }

    @Override
    public List<ApplicationStatusHistoryResponse> getStatusHistory(Long applicationId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return statusHistoryRepository.findByApplicationOrderByChangedAtDesc(application).stream()
                .map(h -> ApplicationStatusHistoryResponse.builder()
                        .id(h.getId())
                        .status(h.getStatus())
                        .changedAt(h.getChangedAt())
                        .comment(h.getComment())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void rejectApplication(Long applicationId, Long recruiterId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getCreatedBy().getId().equals(recruiterId)) {
            throw new InvalidApplicationException("Unauthorized to reject this application.");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED
                || application.getStatus() == ApplicationStatus.REJECTED
                || application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new InvalidApplicationException(
                    "Cannot reject an application in its current state: " + application.getStatus());
        }

        application.setStatus(ApplicationStatus.REJECTED);
        jobApplicationRepository.save(application);
        recordStatusHistory(application, ApplicationStatus.REJECTED, "Rejected by recruiter.");
    }

    private void recordStatusHistory(JobApplication application, ApplicationStatus status, String comment) {
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .status(status)
                .comment(comment)
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .candidateId(application.getCandidate().getId())
                .candidateName(application.getCandidate().getUsername())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
