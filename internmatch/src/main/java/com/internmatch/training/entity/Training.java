package com.internmatch.training.entity;

import com.internmatch.shared.entity.BaseEntity;
import com.internmatch.shared.enums.TrainingLevel;
import com.internmatch.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "trainings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Training extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category;  // e.g. "TECH", "DESIGN", "CAREER", "AI"

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TrainingLevel level;  // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(name = "is_paid")
    private boolean isPaid = false;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Optional: link to external content (YouTube, Google Drive, internal video ID, etc.)
    private String contentUrl;
}