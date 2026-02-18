package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.Interview;
import com.example.hiringsystem.model.InterviewStatus;
import com.example.hiringsystem.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationAndStatus(JobApplication application, InterviewStatus status);

    List<Interview> findByInterviewerId(Long interviewerId);

    List<Interview> findByApplicationId(Long applicationId);
}
