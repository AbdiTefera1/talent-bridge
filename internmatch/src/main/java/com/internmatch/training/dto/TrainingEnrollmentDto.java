package com.internmatch.training.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrainingEnrollmentDto {

    private Long id;
    private Long trainingId;
    private String trainingTitle;
    private Long talentId;
    private String talentName;
    private Integer progressPercentage;
    private boolean isCompleted;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
}