package com.internmatch.application.entity;

import com.internmatch.opportunity.entity.Opportunity;
import com.internmatch.shared.enums.ApplicationStatus;
import com.internmatch.user.entity.TalentProfile;
import com.internmatch.shared.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(name = "unique_application", columnNames = {"opportunity_id", "talent_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talent_id", nullable = false)
    private TalentProfile talent;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    // Optional: company comment when accepting/rejecting
    @Column(columnDefinition = "TEXT")
    private String feedback;
}