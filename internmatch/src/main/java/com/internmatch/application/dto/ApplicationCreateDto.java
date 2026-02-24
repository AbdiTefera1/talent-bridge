package com.internmatch.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationCreateDto {

    @NotNull(message = "Opportunity ID is required")
    private Long opportunityId;

    private String coverLetter;
}