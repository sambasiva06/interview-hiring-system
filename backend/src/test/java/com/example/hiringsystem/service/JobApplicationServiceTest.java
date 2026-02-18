package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.JobApplicationResponse;
import com.example.hiringsystem.exception.DuplicateApplicationException;
import com.example.hiringsystem.exception.InvalidApplicationException;
import com.example.hiringsystem.model.*;
import com.example.hiringsystem.repository.JobApplicationRepository;
import com.example.hiringsystem.repository.JobRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.impl.JobApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private com.example.hiringsystem.repository.ApplicationStatusHistoryRepository statusHistoryRepository;

    @InjectMocks
    private JobApplicationServiceImpl jobApplicationService;

    private User candidate;
    private User recruiter;
    private Job job;

    @BeforeEach
    void setUp() {
        candidate = User.builder().id(1L).username("candidate").role(Role.CANDIDATE).build();
        recruiter = User.builder().id(2L).username("recruiter").role(Role.RECRUITER).build();
        job = Job.builder().id(1L).title("Java Dev").status(JobStatus.OPEN).createdBy(recruiter).build();
    }

    @Test
    void applyToJob_Success() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidate));
        when(jobApplicationRepository.findByJobAndCandidate(job, candidate)).thenReturn(Optional.empty());
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(i -> {
            JobApplication app = i.getArgument(0);
            app.setId(1L);
            app.setAppliedAt(LocalDateTime.now());
            return app;
        });

        JobApplicationResponse response = jobApplicationService.applyToJob(1L, 1L);

        assertNotNull(response);
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        verify(jobApplicationRepository, times(1)).save(any());
    }

    @Test
    void applyToJob_Failure_ClosedJob() {
        job.setStatus(JobStatus.CLOSED);
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidate));

        assertThrows(InvalidApplicationException.class, () -> jobApplicationService.applyToJob(1L, 1L));
    }

    @Test
    void applyToJob_Failure_Duplicate() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidate));
        when(jobApplicationRepository.findByJobAndCandidate(job, candidate))
                .thenReturn(Optional.of(new JobApplication()));

        assertThrows(DuplicateApplicationException.class, () -> jobApplicationService.applyToJob(1L, 1L));
    }

    @Test
    void applyToJob_Failure_WrongRole() {
        User notCandidate = User.builder().id(3L).role(Role.INTERVIEWER).build();
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(3L)).thenReturn(Optional.of(notCandidate));

        assertThrows(InvalidApplicationException.class, () -> jobApplicationService.applyToJob(1L, 3L));
    }

    @Test
    void applyToJob_Failure_RecruiterApplyingToOwnJob() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        // Mock the candidate search for the recruiter who is also a recruiter in the
        // job
        User recruiterTryingToApply = User.builder().id(2L).role(Role.CANDIDATE).build(); // Even if they have candidate
                                                                                          // role?
        // Actually, the check is about createdBy.getId().equals(candidateId)

        when(userRepository.findById(2L)).thenReturn(Optional.of(recruiter)); // Recruiter role

        assertThrows(InvalidApplicationException.class, () -> jobApplicationService.applyToJob(1L, 2L));
    }
}
