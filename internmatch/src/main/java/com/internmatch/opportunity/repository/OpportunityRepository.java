package com.internmatch.opportunity.repository;

import com.internmatch.opportunity.entity.Opportunity;
import com.internmatch.shared.enums.OpportunityStatus;
import com.internmatch.shared.enums.OpportunityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long>, JpaSpecificationExecutor<Opportunity> {

    List<Opportunity> findByCompanyId(Long companyId);

    List<Opportunity> findByType(OpportunityType type);

    List<Opportunity> findByStatus(OpportunityStatus status);

    List<Opportunity> findByIsRemote(boolean isRemote);
}