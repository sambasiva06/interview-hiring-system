package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.JobRequest;
import com.example.hiringsystem.dto.JobResponse;
import com.example.hiringsystem.exception.InvalidCredentialsException;
import com.example.hiringsystem.model.Job;
import com.example.hiringsystem.model.JobStatus;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.repository.JobRepository;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.impl.JobServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobServiceImpl jobService;

    private User recruiter;
    private Job job;

    @BeforeEach
    void setUp() {
        recruiter = User.builder()
                .id(1L)
                .username("recruiter1")
                .role(Role.RECRUITER)
                .build();

        job = Job.builder()
                .id(1L)
                .title("Software Engineer")
                .description("Java Dev")
                .location("New York")
                .status(JobStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .createdBy(recruiter)
                .build();
    }

    @Test
    void shouldCreateJobSuccessfully() {
        JobRequest request = JobRequest.builder()
                .title("Software Engineer")
                .description("Java Dev")
                .location("New York")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(recruiter));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        JobResponse response = jobService.createJob(request, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Software Engineer");
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void shouldThrowExceptionWhenNonRecruiterCreatesJob() {
        User candidate = User.builder()
                .id(2L)
                .username("candidate1")
                .role(Role.CANDIDATE)
                .build();

        JobRequest request = JobRequest.builder().title("Title").build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(candidate));

        assertThatThrownBy(() -> jobService.createJob(request, 2L))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Only recruiters or admins can create jobs");
    }

    @Test
    void shouldGetAllOpenJobs() {
        when(jobRepository.findByStatus(JobStatus.OPEN)).thenReturn(List.of(job));

        List<JobResponse> jobs = jobService.getAllOpenJobs();

        assertThat(jobs).hasSize(1);
        assertThat(jobs.get(0).getStatus()).isEqualTo(JobStatus.OPEN);
    }

    @Test
    void shouldCloseJobSuccessfully() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(recruiter));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        JobResponse response = jobService.closeJob(1L, 1L);

        assertThat(response.getStatus()).isEqualTo(JobStatus.CLOSED);
    }
}
