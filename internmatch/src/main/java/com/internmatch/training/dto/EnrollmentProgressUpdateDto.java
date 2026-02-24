package com.internmatch.training.dto;

import lombok.Data;

@Data
public class EnrollmentProgressUpdateDto {
    private Integer progressPercentage;
    private boolean completed;
}