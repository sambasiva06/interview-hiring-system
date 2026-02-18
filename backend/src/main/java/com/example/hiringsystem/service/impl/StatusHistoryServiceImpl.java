package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.model.ApplicationStatus;
import com.example.hiringsystem.model.ApplicationStatusHistory;
import com.example.hiringsystem.model.JobApplication;
import com.example.hiringsystem.repository.ApplicationStatusHistoryRepository;
import com.example.hiringsystem.service.StatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StatusHistoryServiceImpl implements StatusHistoryService {

    private final ApplicationStatusHistoryRepository repository;

    @Override
    @Transactional
    public void recordHistory(JobApplication application, ApplicationStatus status, String comment) {
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .status(status)
                .comment(comment)
                .changedAt(LocalDateTime.now())
                .build();
        repository.save(history);
    }
}
