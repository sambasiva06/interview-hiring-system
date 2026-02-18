package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.JobRequest;
import com.example.hiringsystem.dto.JobResponse;
import com.example.hiringsystem.model.JobStatus;
import com.example.hiringsystem.service.JobService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JobService jobService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateJob() throws Exception {
        JobRequest request = JobRequest.builder()
                .title("Software Engineer")
                .description("Java Dev")
                .location("NY")
                .build();

        JobResponse response = JobResponse.builder()
                .id(1L)
                .title("Software Engineer")
                .status(JobStatus.OPEN)
                .build();

        when(jobService.createJob(any(JobRequest.class), eq(1L))).thenReturn(response);

        mockMvc.perform(post("/jobs")
                .queryParam("recruiterId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void shouldGetAllOpenJobs() throws Exception {
        JobResponse response = JobResponse.builder()
                .id(1L)
                .title("Software Engineer")
                .status(JobStatus.OPEN)
                .build();

        when(jobService.getAllOpenJobs()).thenReturn(List.of(response));

        mockMvc.perform(get("/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void shouldCloseJob() throws Exception {
        JobResponse response = JobResponse.builder()
                .id(1L)
                .status(JobStatus.CLOSED)
                .build();

        when(jobService.closeJob(eq(1L), eq(1L))).thenReturn(response);

        mockMvc.perform(patch("/jobs/1/close")
                .queryParam("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"));
    }
}
