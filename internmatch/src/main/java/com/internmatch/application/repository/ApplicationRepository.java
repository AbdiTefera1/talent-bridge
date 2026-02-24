package com.internmatch.application.repository;

import com.internmatch.application.entity.Application;
import com.internmatch.opportunity.entity.Opportunity;
import com.internmatch.shared.enums.ApplicationStatus;
import com.internmatch.user.entity.TalentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByOpportunityIdAndTalentId(Long opportunityId, Long talentId);

    List<Application> findByOpportunityId(Long opportunityId);

    List<Application> findByTalentId(Long talentId);

    List<Application> findByOpportunityIdAndStatus(Long opportunityId, ApplicationStatus status);

    boolean existsByOpportunityIdAndTalentId(Long opportunityId, Long talentId);
}