package com.internmatch.user.entity;

import com.internmatch.shared.entity.BaseEntity;
import com.internmatch.shared.enums.Availability;
import com.internmatch.shared.enums.ExperienceLevel;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "talent_profiles")
public class TalentProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 30)
    private ExperienceLevel experienceLevel;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Availability availability;

    private String location;
}
