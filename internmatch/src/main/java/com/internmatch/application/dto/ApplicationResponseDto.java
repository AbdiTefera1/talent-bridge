package com.internmatch.application.dto;

import com.internmatch.shared.enums.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponseDto {

    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private Long talentId;
    private String talentFullName;
    private String talentEmail;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private String feedback;
    private LocalDateTime updatedAt;
}