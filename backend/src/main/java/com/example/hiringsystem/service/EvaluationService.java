package com.example.hiringsystem.service;

import com.example.hiringsystem.dto.EvaluationRequest;
import com.example.hiringsystem.dto.EvaluationResponse;

public interface EvaluationService {
    EvaluationResponse evaluateInterview(EvaluationRequest request, Long interviewerId);
}
