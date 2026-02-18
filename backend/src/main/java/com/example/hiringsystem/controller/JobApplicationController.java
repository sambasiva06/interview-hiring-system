package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.JobApplicationResponse;
import com.example.hiringsystem.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<JobApplicationResponse> applyToJob(@PathVariable Long jobId,
            @RequestParam Long candidateId) {
        JobApplicationResponse response = jobApplicationService.applyToJob(jobId, candidateId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/applications/me")
    public ResponseEntity<List<JobApplicationResponse>> getMyApplications(@RequestParam Long candidateId) {
        List<JobApplicationResponse> responses = jobApplicationService.getMyApplications(candidateId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForJob(@PathVariable Long jobId,
            @RequestParam Long requesterId) {
        List<JobApplicationResponse> responses = jobApplicationService.getApplicationsForJob(jobId, requesterId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/applications/{id}/withdraw")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id, @RequestParam Long candidateId) {
        jobApplicationService.withdrawApplication(id, candidateId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/applications/{id}/reject")
    public ResponseEntity<Void> rejectApplication(@PathVariable Long id, @RequestParam Long recruiterId) {
        jobApplicationService.rejectApplication(id, recruiterId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/applications/{id}/history")
    public ResponseEntity<List<com.example.hiringsystem.dto.ApplicationStatusHistoryResponse>> getStatusHistory(
            @PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getStatusHistory(id));
    }
}
