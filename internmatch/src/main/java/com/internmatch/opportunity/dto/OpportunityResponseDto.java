package com.internmatch.opportunity.dto;

import com.internmatch.shared.enums.ExperienceLevel;
import com.internmatch.shared.enums.OpportunityStatus;
import com.internmatch.shared.enums.OpportunityType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OpportunityResponseDto {

    private Long id;
    private Long companyId;
    private String companyName;           // denormalized for response
    private String title;
    private String description;
    private OpportunityType type;
    private boolean isPaid;
    private BigDecimal salary;
    private String currency;
    private String location;
    private boolean isRemote;
    private ExperienceLevel requiredExperience;
    private OpportunityStatus status;
    private LocalDate deadline;
    private List<String> requiredSkills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}