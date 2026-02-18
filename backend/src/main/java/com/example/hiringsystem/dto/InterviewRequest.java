package com.example.hiringsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewRequest {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Interviewer ID is required")
    private Long interviewerId;

    @NotNull(message = "Schedule time is required")
    private LocalDateTime scheduledAt;
}
