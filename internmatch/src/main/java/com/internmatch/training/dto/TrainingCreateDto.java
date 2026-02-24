package com.internmatch.training.dto;

import com.internmatch.shared.enums.TrainingLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TrainingCreateDto {

    @NotBlank
    private String title;

    private String description;

    private String category;

    @NotNull
    private TrainingLevel level;

    private boolean isPaid = false;

    private BigDecimal price;

    private Integer durationHours;

    private String contentUrl;
}