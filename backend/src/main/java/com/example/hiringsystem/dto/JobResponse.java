package com.example.hiringsystem.dto;

import com.example.hiringsystem.model.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private JobStatus status;
    private LocalDateTime createdAt;
    private String recruiterName;
    private Long recruiterId;
}
