package com.internmatch.opportunity.controller;

import com.internmatch.opportunity.dto.OpportunityCreateDto;
import com.internmatch.opportunity.dto.OpportunityResponseDto;
import com.internmatch.opportunity.dto.OpportunityUpdateDto;
import com.internmatch.opportunity.service.OpportunityService;
import com.internmatch.shared.utils.SecurityUtil;
import com.internmatch.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@Tag(name = "Opportunities", description = "Internship & gig postings management")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final UserRepository userRepository;

    @Operation(
            summary = "Create a new internship or gig posting",
            description = "Only authenticated COMPANY users can create opportunities"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Opportunity created successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - not logged in as company"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<OpportunityResponseDto> createOpportunity(
            @Valid @RequestBody OpportunityCreateDto dto,
            Authentication authentication) {


//         Get current user ID from authentication (assuming you store userId)
        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);

        OpportunityResponseDto created = opportunityService.createOpportunity(userId, dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<OpportunityResponseDto>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityService.getAllOpportunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityResponseDto> getOpportunity(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<OpportunityResponseDto>> getMyOpportunities(Authentication authentication) {

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        return ResponseEntity.ok(opportunityService.getOpportunitiesByCompany(userId));
    }

    // Update opportunity
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<OpportunityResponseDto> updateOpportunity(
            @PathVariable Long id,
            @RequestBody OpportunityUpdateDto dto,
            Authentication authentication) {

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        OpportunityResponseDto updated = opportunityService.updateOpportunity(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    // Close opportunity
    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<OpportunityResponseDto> closeOpportunity(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        OpportunityResponseDto closed = opportunityService.closeOpportunity(id, userId);
        return ResponseEntity.ok(closed);
    }

    // Reopen opportunity
    @PatchMapping("/{id}/reopen")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<OpportunityResponseDto> reopenOpportunity(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        OpportunityResponseDto reopened = opportunityService.reopenOpportunity(id, userId);
        return ResponseEntity.ok(reopened);
    }

    // Delete opportunity
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Void> deleteOpportunity(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        opportunityService.deleteOpportunity(id, userId);
        return ResponseEntity.noContent().build();
    }
}