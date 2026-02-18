package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.InterviewRequest;
import com.example.hiringsystem.dto.InterviewResponse;

import java.util.List;

public interface InterviewService {
    InterviewResponse scheduleInterview(InterviewRequest request, Long recruiterId);

    List<InterviewResponse> getInterviewsForApplication(Long applicationId);

    List<InterviewResponse> getInterviewsByInterviewer(Long interviewerId);

    InterviewResponse updateInterviewStatus(Long interviewId, String status);
}
