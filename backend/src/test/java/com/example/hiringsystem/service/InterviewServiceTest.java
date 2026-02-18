package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.InterviewRequest;
import com.example.hiringsystem.dto.InterviewResponse;
import com.example.hiringsystem.exception.InvalidApplicationException;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.InterviewRepository;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.impl.InterviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private com.example.hiringsystem.service.StatusHistoryService statusHistoryService;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private User recruiter;
    private User interviewer;
    private JobApplication application;
    private InterviewRequest request;

    @BeforeEach
    void setUp() {
        recruiter = User.builder().id(1L).role(Role.RECRUITER).build();
        interviewer = User.builder().id(2L).role(Role.INTERVIEWER).username("interviewer").build();
        // Correctly initialize User objects for Job and Application
        User candidate = User.builder().id(3L).username("candidate").build();
        Job job = Job.builder().id(1L).title("Job").build();
        application = JobApplication.builder().id(1L).candidate(candidate).job(job).build();

        request = InterviewRequest.builder()
                .applicationId(1L)
                .interviewerId(2L)
                .scheduledAt(LocalDateTime.now().plusDays(1))
                .build();
    }

    @Test
    void scheduleInterview_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(recruiter));
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(userRepository.findById(2L)).thenReturn(Optional.of(interviewer));
        when(interviewRepository.findByApplicationAndStatus(eq(application), eq(InterviewStatus.SCHEDULED)))
                .thenReturn(Collections.emptyList());
        when(interviewRepository.save(any(Interview.class))).thenAnswer(i -> {
            Interview entity = i.getArgument(0);
            entity.setId(1L);
            return entity;
        });

        InterviewResponse response = interviewService.scheduleInterview(request, 1L);

        assertNotNull(response);
        assertEquals(InterviewStatus.SCHEDULED, response.getStatus());
        assertEquals("interviewer", response.getInterviewerName());
    }

    @Test
    void scheduleInterview_Failure_NotRecruiter() {
        User candidate = User.builder().id(4L).role(Role.CANDIDATE).build();
        when(userRepository.findById(4L)).thenReturn(Optional.of(candidate));

        assertThrows(InvalidApplicationException.class, () -> interviewService.scheduleInterview(request, 4L));
    }

    @Test
    void scheduleInterview_Failure_NotInterviewerRole() {
        User notInterviewer = User.builder().id(5L).role(Role.CANDIDATE).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(recruiter));
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(userRepository.findById(2L)).thenReturn(Optional.of(notInterviewer));

        assertThrows(InvalidApplicationException.class, () -> interviewService.scheduleInterview(request, 1L));
    }

    @Test
    void scheduleInterview_Failure_AlreadyScheduled() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(recruiter));
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(userRepository.findById(2L)).thenReturn(Optional.of(interviewer));
        when(interviewRepository.findByApplicationAndStatus(eq(application), eq(InterviewStatus.SCHEDULED)))
                .thenReturn(Collections.singletonList(new Interview()));

        assertThrows(InvalidApplicationException.class, () -> interviewService.scheduleInterview(request, 1L));
    }
}
