package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.JobApplicationResponse;
import com.example.hiringsystem.model.ApplicationStatus;
import com.example.hiringsystem.service.JobApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JobApplicationController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JobApplicationService jobApplicationService;

    @Test
    void applyToJob_ShouldReturnCreated() throws Exception {
        JobApplicationResponse response = JobApplicationResponse.builder()
                .id(1L)
                .status(ApplicationStatus.APPLIED)
                .build();

        when(jobApplicationService.applyToJob(anyLong(), anyLong())).thenReturn(response);

        mockMvc.perform(post("/jobs/1/apply")
                .param("candidateId", "1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void getMyApplications_ShouldReturnList() throws Exception {
        JobApplicationResponse response = JobApplicationResponse.builder()
                .id(1L)
                .status(ApplicationStatus.APPLIED)
                .build();

        when(jobApplicationService.getMyApplications(anyLong())).thenReturn(List.of(response));

        mockMvc.perform(get("/applications/me")
                .param("candidateId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getApplicationsForJob_ShouldReturnList() throws Exception {
        JobApplicationResponse response = JobApplicationResponse.builder()
                .id(1L)
                .status(ApplicationStatus.APPLIED)
                .build();

        when(jobApplicationService.getApplicationsForJob(anyLong(), anyLong())).thenReturn(List.of(response));

        mockMvc.perform(get("/jobs/1/applications")
                .param("requesterId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}
