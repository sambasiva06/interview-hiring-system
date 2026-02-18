package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.JobApplicationResponse;
import java.util.List;

public interface JobApplicationService {
    JobApplicationResponse applyToJob(Long jobId, Long candidateId);

    List<JobApplicationResponse> getMyApplications(Long candidateId);

    List<JobApplicationResponse> getApplicationsForJob(Long jobId, Long requesterId);

    void withdrawApplication(Long applicationId, Long candidateId);

    void rejectApplication(Long applicationId, Long recruiterId);

    List<com.example.hiringsystem.dto.ApplicationStatusHistoryResponse> getStatusHistory(Long applicationId);
}
