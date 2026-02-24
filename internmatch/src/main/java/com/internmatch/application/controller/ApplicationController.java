package com.internmatch.application.controller;

import com.internmatch.application.dto.ApplicationCreateDto;
import com.internmatch.application.dto.ApplicationResponseDto;
import com.internmatch.application.dto.ApplicationStatusUpdateDto;
import com.internmatch.application.repository.ApplicationRepository;
import com.internmatch.application.service.ApplicationService;
import com.internmatch.shared.utils.SecurityUtil;
import com.internmatch.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('TALENT')")
    public ResponseEntity<ApplicationResponseDto> apply(
            @Valid @RequestBody ApplicationCreateDto dto,
            Authentication authentication) {

        Long talentUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        ApplicationResponseDto created = applicationService.applyToOpportunity(talentUserId, dto);
        return ResponseEntity.ok(created);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApplicationResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDto dto,
            Authentication authentication) {

        Long companyUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        ApplicationResponseDto updated = applicationService.updateApplicationStatus(id, companyUserId, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/opportunity/{opportunityId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsForOpportunity(
            @PathVariable Long opportunityId,
            Authentication authentication) {

        Long companyUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        return ResponseEntity.ok(applicationService.getApplicationsForOpportunity(opportunityId, companyUserId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TALENT')")
    public ResponseEntity<List<ApplicationResponseDto>> getMyApplications(Authentication authentication) {
        Long talentUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        return ResponseEntity.ok(applicationService.getMyApplications(talentUserId));
    }
}