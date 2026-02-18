package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.ApplicationStatusHistory;
import com.example.hiringsystem.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    List<ApplicationStatusHistory> findByApplicationOrderByChangedAtDesc(JobApplication application);
}
