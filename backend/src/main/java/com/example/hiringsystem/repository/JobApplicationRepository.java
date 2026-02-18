package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.JobApplication;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidate(User candidate);

    List<JobApplication> findByJob(Job job);

    Optional<JobApplication> findByJobAndCandidate(Job job, User candidate);
}
