package com.example.hiringsystem.dto;

import com.example.hiringsystem.model.ApplicationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusHistoryResponse {
    private Long id;
    private ApplicationStatus status;
    private LocalDateTime changedAt;
    private String comment;
}
