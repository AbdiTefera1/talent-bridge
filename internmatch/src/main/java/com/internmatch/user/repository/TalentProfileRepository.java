package com.internmatch.user.repository;

import com.internmatch.user.entity.TalentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TalentProfileRepository extends JpaRepository<TalentProfile, Long> {
    Optional<TalentProfile> findByUserId(Long userId);
}