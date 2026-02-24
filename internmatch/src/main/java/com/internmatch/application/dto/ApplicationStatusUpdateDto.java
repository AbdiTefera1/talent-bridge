package com.internmatch.application.dto;

import com.internmatch.shared.enums.ApplicationStatus;
import lombok.Data;

@Data
public class ApplicationStatusUpdateDto {

    private ApplicationStatus status;

    private String feedback;
}