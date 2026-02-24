package com.internmatch.user.entity;

import com.internmatch.shared.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "company_profiles")
public class CompanyProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String industry;

    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "company_size")
    private String companySize;

    private String location;
}
