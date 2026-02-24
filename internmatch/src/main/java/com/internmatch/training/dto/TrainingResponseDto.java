package com.internmatch.training.dto;

import com.internmatch.shared.enums.TrainingLevel;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TrainingResponseDto {

    private Long id;
    private String title;
    private String description;
    private String category;
    private TrainingLevel level;
    private boolean isPaid;
    private BigDecimal price;
    private Integer durationHours;
    private Long createdById;
    private String createdByName;   // optional
    private String contentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}