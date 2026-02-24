package com.internmatch.opportunity.entity;

import com.internmatch.shared.entity.BaseEntity;
import com.internmatch.shared.enums.ExperienceLevel;
import com.internmatch.shared.enums.OpportunityStatus;
import com.internmatch.shared.enums.OpportunityType;
import com.internmatch.user.entity.CompanyProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyProfile company;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "text", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OpportunityType type;           // INTERNSHIP, GIG

    @Column(name = "is_paid")
    private boolean isPaid = false;

    @Column(precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(length = 10)
    private String currency = "ETB";

    @Column(length = 100)
    private String location;

    @Column(name = "is_remote")
    private boolean isRemote = true;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ExperienceLevel requiredExperience;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private OpportunityStatus status = OpportunityStatus.OPEN;

    private LocalDate deadline;

    @Column(columnDefinition = "text[]")
    private String[] requiredSkills;

    public List<String> getRequiredSkillsAsList() {
        return requiredSkills != null ? Arrays.asList(requiredSkills) : List.of();
    }

    public void setRequiredSkillsFromList(List<String> skills) {
        this.requiredSkills = skills != null ? skills.toArray(new String[0]) : null;
    }
}