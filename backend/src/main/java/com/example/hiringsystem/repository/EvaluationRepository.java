package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.Evaluation;
import com.example.hiringsystem.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByInterview(Interview interview);
}
