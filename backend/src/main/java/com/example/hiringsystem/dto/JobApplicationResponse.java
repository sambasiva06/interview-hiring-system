package com.example.hiringsystem.dto;

import com.example.hiringsystem.model.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long candidateId;
    private String candidateName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
