package com.internmatch.user.controller;  // or .company.controller

import com.internmatch.shared.utils.SecurityUtil;
import com.internmatch.user.dto.CompanyProfileResponseDto;
import com.internmatch.user.entity.CompanyProfile;
import com.internmatch.user.entity.User;
import com.internmatch.user.repository.CompanyProfileRepository;
import com.internmatch.user.repository.UserRepository;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyProfileResponseDto> getMyCompanyProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        Long userId = SecurityUtil.getCurrentUserId(authentication, userRepository);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Company profile not found for user ID: " + userId
                ));

        CompanyProfileResponseDto dto = mapToResponseDto(profile);
        return ResponseEntity.ok(dto);
    }



    private CompanyProfileResponseDto mapToResponseDto(CompanyProfile profile) {
        CompanyProfileResponseDto dto = new CompanyProfileResponseDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setCompanyName(profile.getCompanyName());
        dto.setIndustry(profile.getIndustry());
        dto.setWebsite(profile.getWebsite());
        dto.setDescription(profile.getDescription());
        dto.setCompanySize(profile.getCompanySize());
        dto.setLocation(profile.getLocation());

        User user = profile.getUser();
        if (user != null) {
            dto.setEmail(user.getEmail());
            dto.setFullName(user.getFullName());
        }
        return dto;
    }
}