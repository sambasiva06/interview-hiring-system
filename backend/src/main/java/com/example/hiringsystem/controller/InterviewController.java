package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.InterviewRequest;
import com.example.hiringsystem.dto.InterviewResponse;
import com.example.hiringsystem.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest request,
            @RequestParam Long recruiterId) {
        InterviewResponse response = interviewService.scheduleInterview(request, recruiterId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsForApplication(@PathVariable Long applicationId) {
        List<InterviewResponse> responses = interviewService.getInterviewsForApplication(applicationId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByInterviewer(@PathVariable Long interviewerId) {
        List<InterviewResponse> responses = interviewService.getInterviewsByInterviewer(interviewerId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        InterviewResponse response = interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
