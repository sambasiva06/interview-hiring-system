package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.dto.EvaluationRequest;
import com.example.hiringsystem.dto.EvaluationResponse;
import com.example.hiringsystem.exception.InvalidApplicationException;
import com.example.hiringsystem.exception.ResourceNotFoundException;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.EvaluationRepository;
import com.example.hiringsystem.repository.InterviewRepository;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final com.example.hiringsystem.service.StatusHistoryService statusHistoryService;

    @Override
    public EvaluationResponse evaluateInterview(EvaluationRequest request, Long interviewerId) {
        Interview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (!interview.getInterviewer().getId().equals(interviewerId)) {
            throw new InvalidApplicationException("Only the assigned interviewer can submit evaluation.");
        }

        if (interview.getStatus() != InterviewStatus.SCHEDULED) {
            throw new InvalidApplicationException("Evaluations can only be submitted for scheduled interviews.");
        }

        if (evaluationRepository.findByInterview(interview).isPresent()) {
            throw new InvalidApplicationException("Evaluation already exists for this interview.");
        }

        // Mark interview as completed
        interview.setStatus(InterviewStatus.COMPLETED);
        interviewRepository.save(interview);

        int totalScore = request.getTechnicalScore() + request.getCommunicationScore()
                + request.getProblemSolvingScore();
        EvaluationResult result;
        if (totalScore >= 24) {
            result = EvaluationResult.PASS;
        } else if (totalScore >= 15) {
            result = EvaluationResult.HOLD;
        } else {
            result = EvaluationResult.FAIL;
        }

        Evaluation evaluation = Evaluation.builder()
                .interview(interview)
                .technicalScore(request.getTechnicalScore())
                .communicationScore(request.getCommunicationScore())
                .problemSolvingScore(request.getProblemSolvingScore())
                .comments(request.getComments())
                .result(result)
                .build();

        Evaluation saved = evaluationRepository.save(evaluation);

        // Update JobApplication status
        JobApplication application = interview.getApplication();
        if (result == EvaluationResult.PASS) {
            application.setStatus(ApplicationStatus.SELECTED);
            statusHistoryService.recordHistory(application, ApplicationStatus.SELECTED,
                    "Candidate cleared the interview.");
        } else if (result == EvaluationResult.FAIL) {
            application.setStatus(ApplicationStatus.REJECTED);
            statusHistoryService.recordHistory(application, ApplicationStatus.REJECTED,
                    "Candidate did not clear the interview.");
        }
        jobApplicationRepository.save(application);

        return mapToResponse(saved);
    }

    private EvaluationResponse mapToResponse(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .interviewId(evaluation.getInterview().getId())
                .technicalScore(evaluation.getTechnicalScore())
                .communicationScore(evaluation.getCommunicationScore())
                .problemSolvingScore(evaluation.getProblemSolvingScore())
                .comments(evaluation.getComments())
                .result(evaluation.getResult())
                .build();
    }
}
