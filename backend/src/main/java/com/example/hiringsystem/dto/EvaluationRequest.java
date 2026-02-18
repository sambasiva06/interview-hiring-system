package com.example.hiringsystem.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRequest {
    @NotNull(message = "Interview ID is required")
    private Long interviewId;

    @Min(1)
    @Max(10)
    private Integer technicalScore;

    @Min(1)
    @Max(10)
    private Integer communicationScore;

    @Min(1)
    @Max(10)
    private Integer problemSolvingScore;

    private String comments;
}
