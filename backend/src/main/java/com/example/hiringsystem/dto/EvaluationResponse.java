package com.example.hiringsystem.dto;

import com.example.hiringsystem.model.EvaluationResult;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResponse {
    private Long id;
    private Long interviewId;
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer problemSolvingScore;
    private String comments;
    private EvaluationResult result;
}
