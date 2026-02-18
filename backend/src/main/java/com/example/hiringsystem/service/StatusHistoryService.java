package com.example.hiringsystem.service;

import com.example.hiringsystem.model.ApplicationStatus;
import com.example.hiringsystem.model.JobApplication;

public interface StatusHistoryService {
    void recordHistory(JobApplication application, ApplicationStatus status, String comment);
}
