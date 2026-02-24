package com.internmatch.user.repository;

import com.internmatch.user.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    /**
     * Most common query: find company profile by the associated user ID
     * (used when the current authenticated user wants to access their own company profile)
     */
    Optional<CompanyProfile> findByUserId(Long userId);

    /**
     * Alternative: find by user email (less common, but useful for some admin flows)
     */
    Optional<CompanyProfile> findByUserEmail(String email);

    /**
     * Check if a company profile already exists for a given user
     */
    boolean existsByUserId(Long userId);

    /**
     * Optional: find all companies in a specific industry (for future search/filter features)
     */
    List<CompanyProfile> findByIndustry(String industry);

    /**
     * Optional: find companies by location (useful for Ethiopia-focused filtering)
     */
    List<CompanyProfile> findByLocation(String location);
}