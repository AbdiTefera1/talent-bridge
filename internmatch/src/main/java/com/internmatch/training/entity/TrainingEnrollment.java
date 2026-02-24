package com.internmatch.training.entity;

import com.internmatch.shared.entity.BaseEntity;
import com.internmatch.user.entity.TalentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "training_enrollments",
        uniqueConstraints = @UniqueConstraint(name = "unique_enrollment", columnNames = {"training_id", "talent_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingEnrollment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private Training training;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talent_id", nullable = false)
    private TalentProfile talent;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "is_completed")
    private boolean isCompleted = false;

    @Column(name = "enrolled_at", updatable = false)
    private LocalDateTime enrolledAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}