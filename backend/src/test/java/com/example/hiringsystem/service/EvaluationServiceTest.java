package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.EvaluationRequest;
import com.example.hiringsystem.dto.EvaluationResponse;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.EvaluationRepository;
import com.example.hiringsystem.repository.InterviewRepository;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.service.impl.EvaluationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EvaluationServiceTest {

    @Mock
    private EvaluationRepository evaluationRepository;

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private com.example.hiringsystem.service.StatusHistoryService statusHistoryService;

    @InjectMocks
    private EvaluationServiceImpl evaluationService;

    private User interviewer;
    private Interview interview;
    private JobApplication application;
    private EvaluationRequest request;

    @BeforeEach
    void setUp() {
        interviewer = User.builder().id(1L).role(Role.INTERVIEWER).build();
        application = JobApplication.builder().id(1L).status(ApplicationStatus.APPLIED).build();
        interview = Interview.builder().id(1L).interviewer(interviewer).application(application)
                .status(InterviewStatus.SCHEDULED).build();

        request = EvaluationRequest.builder()
                .interviewId(1L)
                .technicalScore(9)
                .communicationScore(9)
                .problemSolvingScore(9)
                .comments("Great candidate")
                .build();
    }

    @Test
    void evaluateInterview_Pass() {
        when(interviewRepository.findById(1L)).thenReturn(Optional.of(interview));
        when(evaluationRepository.findByInterview(interview)).thenReturn(Optional.empty());
        when(evaluationRepository.save(any(Evaluation.class))).thenAnswer(i -> i.getArgument(0));

        EvaluationResponse response = evaluationService.evaluateInterview(request, 1L);

        assertNotNull(response);
        assertEquals(EvaluationResult.PASS, response.getResult());
        assertEquals(ApplicationStatus.SELECTED, application.getStatus());
        verify(jobApplicationRepository, times(1)).save(application);
    }

    @Test
    void evaluateInterview_Fail() {
        request.setTechnicalScore(2);
        request.setCommunicationScore(2);
        request.setProblemSolvingScore(2);
        when(interviewRepository.findById(1L)).thenReturn(Optional.of(interview));
        when(evaluationRepository.findByInterview(interview)).thenReturn(Optional.empty());
        when(evaluationRepository.save(any(Evaluation.class))).thenAnswer(i -> i.getArgument(0));

        EvaluationResponse response = evaluationService.evaluateInterview(request, 1L);

        assertNotNull(response);
        assertEquals(EvaluationResult.FAIL, response.getResult());
        assertEquals(ApplicationStatus.REJECTED, application.getStatus());
        verify(jobApplicationRepository, times(1)).save(application);
    }

    @Test
    void evaluateInterview_Hold() {
        request.setTechnicalScore(5);
        request.setCommunicationScore(5);
        request.setProblemSolvingScore(5);
        when(interviewRepository.findById(1L)).thenReturn(Optional.of(interview));
        when(evaluationRepository.findByInterview(interview)).thenReturn(Optional.empty());
        when(evaluationRepository.save(any(Evaluation.class))).thenAnswer(i -> i.getArgument(0));

        EvaluationResponse response = evaluationService.evaluateInterview(request, 1L);

        assertNotNull(response);
        assertEquals(EvaluationResult.HOLD, response.getResult());
        // Application status should not change from APPLIED
        assertEquals(ApplicationStatus.APPLIED, application.getStatus());
    }
}
