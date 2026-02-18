package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.dto.InterviewRequest;
import com.example.hiringsystem.dto.InterviewResponse;
import com.example.hiringsystem.exception.InvalidApplicationException;
import com.example.hiringsystem.exception.ResourceNotFoundException;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.InterviewRepository;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewServiceImpl implements InterviewService {

        private final InterviewRepository interviewRepository;
        private final JobApplicationRepository jobApplicationRepository;
        private final UserRepository userRepository;
        private final com.example.hiringsystem.service.StatusHistoryService statusHistoryService;

        @Override
        public InterviewResponse scheduleInterview(InterviewRequest request, Long recruiterId) {
                User recruiter = userRepository.findById(recruiterId)
                                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

                if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
                        throw new InvalidApplicationException("Only recruiters or admins can schedule interviews.");
                }

                JobApplication application = jobApplicationRepository.findById(request.getApplicationId())
                                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

                User interviewer = userRepository.findById(request.getInterviewerId())
                                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found"));

                if (interviewer.getRole() != Role.INTERVIEWER) {
                        throw new InvalidApplicationException("Assigned user must have the INTERVIEWER role.");
                }

                // Rule: Only one active interview per application
                List<Interview> activeInterviews = interviewRepository.findByApplicationAndStatus(application,
                                InterviewStatus.SCHEDULED);
                if (!activeInterviews.isEmpty()) {
                        throw new InvalidApplicationException("Application already has a scheduled interview.");
                }

                Interview interview = Interview.builder()
                                .application(application)
                                .interviewer(interviewer)
                                .status(InterviewStatus.SCHEDULED)
                                .scheduledAt(request.getScheduledAt())
                                .build();

                Interview saved = interviewRepository.save(interview);

                // Update Application Status
                application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
                jobApplicationRepository.save(application);
                statusHistoryService.recordHistory(application, ApplicationStatus.INTERVIEW_SCHEDULED,
                                "Interview scheduled with " + interviewer.getUsername() + " at "
                                                + request.getScheduledAt());

                return mapToResponse(saved);
        }

        @Override
        public List<InterviewResponse> getInterviewsForApplication(Long applicationId) {
                if (!jobApplicationRepository.existsById(applicationId)) {
                        throw new ResourceNotFoundException("Application not found");
                }
                return interviewRepository.findByApplicationId(applicationId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<InterviewResponse> getInterviewsByInterviewer(Long interviewerId) {
                return interviewRepository.findByInterviewerId(interviewerId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public InterviewResponse updateInterviewStatus(Long interviewId, String status) {
                Interview interview = interviewRepository.findById(interviewId)
                                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

                interview.setStatus(InterviewStatus.valueOf(status.toUpperCase()));
                Interview updated = interviewRepository.save(interview);
                return mapToResponse(updated);
        }

        private InterviewResponse mapToResponse(Interview interview) {
                return InterviewResponse.builder()
                                .id(interview.getId())
                                .applicationId(interview.getApplication().getId())
                                .candidateName(interview.getApplication().getCandidate().getUsername())
                                .jobTitle(interview.getApplication().getJob().getTitle())
                                .interviewerId(interview.getInterviewer().getId())
                                .interviewerName(interview.getInterviewer().getUsername())
                                .status(interview.getStatus())
                                .scheduledAt(interview.getScheduledAt())
                                .build();
        }
}
