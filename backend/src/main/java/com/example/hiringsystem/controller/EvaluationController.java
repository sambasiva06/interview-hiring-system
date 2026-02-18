package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.EvaluationRequest;
import com.example.hiringsystem.dto.EvaluationResponse;
import com.example.hiringsystem.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<EvaluationResponse> evaluateInterview(@Valid @RequestBody EvaluationRequest request,
            @RequestParam Long interviewerId) {
        EvaluationResponse response = evaluationService.evaluateInterview(request, interviewerId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
