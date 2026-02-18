package com.example.hiringsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @Column(nullable = false)
    private Integer technicalScore;

    @Column(nullable = false)
    private Integer communicationScore;

    @Column(nullable = false)
    private Integer problemSolvingScore;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationResult result;
}
