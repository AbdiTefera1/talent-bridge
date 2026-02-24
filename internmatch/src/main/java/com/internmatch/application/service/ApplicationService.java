package com.internmatch.application.service;

import com.internmatch.application.dto.ApplicationCreateDto;
import com.internmatch.application.dto.ApplicationResponseDto;
import com.internmatch.application.dto.ApplicationStatusUpdateDto;
import com.internmatch.application.entity.Application;
import com.internmatch.application.repository.ApplicationRepository;
import com.internmatch.opportunity.entity.Opportunity;
import com.internmatch.opportunity.repository.OpportunityRepository;
import com.internmatch.shared.enums.ApplicationStatus;
import com.internmatch.user.entity.TalentProfile;
import com.internmatch.user.repository.TalentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final TalentProfileRepository talentProfileRepository;

    @Transactional
    public ApplicationResponseDto applyToOpportunity(Long talentUserId, ApplicationCreateDto dto) {
        TalentProfile talent = talentProfileRepository.findByUserId(talentUserId)
                .orElseThrow(() -> new RuntimeException("Talent profile not found"));

        Opportunity opportunity = opportunityRepository.findById(dto.getOpportunityId())
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (applicationRepository.existsByOpportunityIdAndTalentId(opportunity.getId(), talent.getId())) {
            throw new RuntimeException("You have already applied to this opportunity");
        }

        Application application = new Application();
        application.setOpportunity(opportunity);
        application.setTalent(talent);
        application.setCoverLetter(dto.getCoverLetter());
        application.setStatus(ApplicationStatus.PENDING);

        application = applicationRepository.save(application);

        return mapToResponse(application);
    }

    @Transactional
    public ApplicationResponseDto updateApplicationStatus(Long applicationId, Long companyUserId,
                                                          ApplicationStatusUpdateDto dto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Security check: only the company that owns the opportunity can update
        if (!application.getOpportunity().getCompany().getUser().getId().equals(companyUserId)) {
            throw new SecurityException("You are not authorized to update this application");
        }

        application.setStatus(dto.getStatus());
        application.setFeedback(dto.getFeedback());

        application = applicationRepository.save(application);

        return mapToResponse(application);
    }

    public List<ApplicationResponseDto> getApplicationsForOpportunity(Long opportunityId, Long companyUserId) {
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (!opp.getCompany().getUser().getId().equals(companyUserId)) {
            throw new SecurityException("Not authorized to view applications for this opportunity");
        }

        return applicationRepository.findByOpportunityId(opportunityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getMyApplications(Long talentUserId) {
        TalentProfile talent = talentProfileRepository.findByUserId(talentUserId)
                .orElseThrow(() -> new RuntimeException("Talent profile not found"));

        return applicationRepository.findByTalentId(talent.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ApplicationResponseDto mapToResponse(Application app) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(app.getId());
        dto.setOpportunityId(app.getOpportunity().getId());
        dto.setOpportunityTitle(app.getOpportunity().getTitle());
        dto.setTalentId(app.getTalent().getId());
        dto.setTalentFullName(app.getTalent().getUser().getFullName());
        dto.setTalentEmail(app.getTalent().getUser().getEmail());
        dto.setStatus(app.getStatus());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setFeedback(app.getFeedback());
        dto.setUpdatedAt(app.getUpdatedAt());
        return dto;
    }
}