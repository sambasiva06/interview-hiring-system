package com.example.hiringsystem.dto;

import com.example.hiringsystem.model.InterviewStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String candidateName;
    private String jobTitle;
    private Long interviewerId;
    private String interviewerName;
    private InterviewStatus status;
    private LocalDateTime scheduledAt;
}
