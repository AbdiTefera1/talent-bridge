package com.internmatch.opportunity.dto;

import com.internmatch.shared.enums.ExperienceLevel;
import com.internmatch.shared.enums.OpportunityType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OpportunityUpdateDto {

    private String title;
    private String description;
    private OpportunityType type;
    private Boolean paid;
    private BigDecimal salary;
    private String currency;
    private String location;
    private Boolean remote;
    private ExperienceLevel requiredExperience;
    private LocalDate deadline;
    private List<String> requiredSkills;
}