package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.Job;
import com.example.hiringsystem.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);

    long countByCreatedByIdAndStatus(Long recruiterId, JobStatus status);

    long countByCreatedById(Long recruiterId);
}
