package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.JobRequest;
import com.example.hiringsystem.dto.JobResponse;
import com.example.hiringsystem.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request,
            @RequestParam Long recruiterId) {
        JobResponse response = jobService.createJob(request, recruiterId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllOpenJobs() {
        List<JobResponse> jobs = jobService.getAllOpenJobs();
        return ResponseEntity.ok(jobs);
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<JobResponse> closeJob(@PathVariable Long id, @RequestParam Long userId) {
        JobResponse response = jobService.closeJob(id, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request,
            @RequestParam Long userId) {
        JobResponse response = jobService.updateJob(id, request, userId);
        return ResponseEntity.ok(response);
    }
}
