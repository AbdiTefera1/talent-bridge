package com.internmatch.opportunity.dto;

import com.internmatch.shared.enums.ExperienceLevel;
import com.internmatch.shared.enums.OpportunityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OpportunityCreateDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Type is required")
    private OpportunityType type;

    private boolean isPaid = false;

    private BigDecimal salary;

    private String currency = "ETB";

    private String location;

    private boolean isRemote = true;

    private ExperienceLevel requiredExperience;

    private LocalDate deadline;

    private List<String> requiredSkills;
}