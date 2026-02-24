package com.internmatch.opportunity.service;

import com.internmatch.opportunity.dto.OpportunityCreateDto;
import com.internmatch.opportunity.dto.OpportunityResponseDto;
import com.internmatch.opportunity.dto.OpportunityUpdateDto; // ← new DTO (see below)
import com.internmatch.opportunity.entity.Opportunity;
import com.internmatch.opportunity.repository.OpportunityRepository;
import com.internmatch.shared.enums.OpportunityStatus;
import com.internmatch.user.entity.CompanyProfile;
import com.internmatch.user.repository.CompanyProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final CompanyProfileRepository companyProfileRepository;

    // ────────────────────────────────────────────────
    // CREATE
    // ────────────────────────────────────────────────
    @Transactional
    public OpportunityResponseDto createOpportunity(Long userId, OpportunityCreateDto dto) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Company profile not found. Please complete your company profile first."
                ));

        Opportunity opportunity = new Opportunity();
        opportunity.setCompany(company);
        opportunity.setTitle(dto.getTitle());
        opportunity.setDescription(dto.getDescription());
        opportunity.setType(dto.getType());
        opportunity.setPaid(dto.isPaid());
        opportunity.setSalary(dto.getSalary());
        opportunity.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "ETB");
        opportunity.setLocation(dto.getLocation());
        opportunity.setRemote(dto.isRemote());
        opportunity.setRequiredExperience(dto.getRequiredExperience());
        opportunity.setDeadline(dto.getDeadline());
        opportunity.setStatus(OpportunityStatus.OPEN);

        // Convert List<String> → String[] for text[] column
        if (dto.getRequiredSkills() != null && !dto.getRequiredSkills().isEmpty()) {
            opportunity.setRequiredSkills(dto.getRequiredSkills().toArray(new String[0]));
        } else {
            opportunity.setRequiredSkills(null);
        }

        opportunity = opportunityRepository.save(opportunity);
        return mapToResponse(opportunity);
    }

    // ────────────────────────────────────────────────
    // READ
    // ────────────────────────────────────────────────
    public List<OpportunityResponseDto> getAllOpportunities() {
        return opportunityRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OpportunityResponseDto getOpportunityById(Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));
        return mapToResponse(opp);
    }

    public List<OpportunityResponseDto> getOpportunitiesByCompany(Long companyUserId) {
        CompanyProfile company = companyProfileRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Company profile not found"
                ));

        return opportunityRepository.findByCompanyId(company.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ────────────────────────────────────────────────
    // UPDATE (partial update)
    // ────────────────────────────────────────────────
    @Transactional
    public OpportunityResponseDto updateOpportunity(Long opportunityId, OpportunityUpdateDto dto, Long currentUserId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        // Security: only the owning company can update
        if (!opportunity.getCompany().getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this opportunity");
        }

        if (dto.getTitle() != null) opportunity.setTitle(dto.getTitle());
        if (dto.getDescription() != null) opportunity.setDescription(dto.getDescription());
        if (dto.getType() != null) opportunity.setType(dto.getType());
        if (dto.getPaid() != null) opportunity.setPaid(dto.getPaid());
        if (dto.getSalary() != null) opportunity.setSalary(dto.getSalary());
        if (dto.getCurrency() != null) opportunity.setCurrency(dto.getCurrency());
        if (dto.getLocation() != null) opportunity.setLocation(dto.getLocation());
        if (dto.getRemote() != null) opportunity.setRemote(dto.getRemote());
        if (dto.getRequiredExperience() != null) opportunity.setRequiredExperience(dto.getRequiredExperience());
        if (dto.getDeadline() != null) opportunity.setDeadline(dto.getDeadline());

        // Skills update
        if (dto.getRequiredSkills() != null) {
            opportunity.setRequiredSkills(dto.getRequiredSkills().toArray(new String[0]));
        }

        opportunity = opportunityRepository.save(opportunity);
        return mapToResponse(opportunity);
    }

    // ────────────────────────────────────────────────
    // CLOSE / REOPEN
    // ────────────────────────────────────────────────
    @Transactional
    public OpportunityResponseDto closeOpportunity(Long opportunityId, Long currentUserId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        if (!opportunity.getCompany().getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this opportunity");
        }

        opportunity.setStatus(OpportunityStatus.CLOSED);
        opportunity = opportunityRepository.save(opportunity);
        return mapToResponse(opportunity);
    }

    @Transactional
    public OpportunityResponseDto reopenOpportunity(Long opportunityId, Long currentUserId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        if (!opportunity.getCompany().getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this opportunity");
        }

        if (opportunity.getStatus() != OpportunityStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Opportunity is not closed");
        }

        opportunity.setStatus(OpportunityStatus.OPEN);
        opportunity = opportunityRepository.save(opportunity);
        return mapToResponse(opportunity);
    }

    // ────────────────────────────────────────────────
    // DELETE
    // ────────────────────────────────────────────────
    @Transactional
    public void deleteOpportunity(Long opportunityId, Long currentUserId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));

        if (!opportunity.getCompany().getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this opportunity");
        }

        opportunityRepository.delete(opportunity);
    }

    // ────────────────────────────────────────────────
    // Mapping
    // ────────────────────────────────────────────────
    private OpportunityResponseDto mapToResponse(Opportunity opp) {
        OpportunityResponseDto dto = new OpportunityResponseDto();
        dto.setId(opp.getId());
        dto.setCompanyId(opp.getCompany().getId());
        dto.setCompanyName(opp.getCompany().getCompanyName());
        dto.setTitle(opp.getTitle());
        dto.setDescription(opp.getDescription());
        dto.setType(opp.getType());
        dto.setPaid(opp.isPaid());
        dto.setSalary(opp.getSalary());
        dto.setCurrency(opp.getCurrency());
        dto.setLocation(opp.getLocation());
        dto.setRemote(opp.isRemote());
        dto.setRequiredExperience(opp.getRequiredExperience());
        dto.setStatus(opp.getStatus());
        dto.setDeadline(opp.getDeadline());
        dto.setCreatedAt(opp.getCreatedAt());
        dto.setUpdatedAt(opp.getUpdatedAt());

        // Convert String[] → List<String> for DTO
        dto.setRequiredSkills(
                opp.getRequiredSkills() != null
                        ? Arrays.asList(opp.getRequiredSkills())
                        : List.of()
        );

        return dto;
    }
}