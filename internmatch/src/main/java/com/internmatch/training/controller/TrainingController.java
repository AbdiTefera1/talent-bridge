package com.internmatch.training.controller;

import com.internmatch.shared.utils.SecurityUtil;
import com.internmatch.training.dto.*;
import com.internmatch.training.service.TrainingService;
import com.internmatch.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;
    private final UserRepository userRepository;
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY')")  // or whoever can create trainings
    public ResponseEntity<TrainingResponseDto> createTraining(
            @Valid @RequestBody TrainingCreateDto dto,
            Authentication authentication) {

        Long creatorId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        TrainingResponseDto created = trainingService.createTraining(creatorId, dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{trainingId}/enroll")
    @PreAuthorize("hasRole('TALENT')")
    public ResponseEntity<TrainingEnrollmentDto> enroll(
            @PathVariable Long trainingId,
            Authentication authentication) {

        Long talentUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        TrainingEnrollmentDto enrollment = trainingService.enrollInTraining(talentUserId, trainingId);
        return ResponseEntity.ok(enrollment);
    }

    @PatchMapping("/enrollments/{enrollmentId}/progress")
    @PreAuthorize("hasRole('TALENT')")
    public ResponseEntity<TrainingEnrollmentDto> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestBody EnrollmentProgressUpdateDto dto,
            Authentication authentication) {

        // Optional: check ownership
        TrainingEnrollmentDto updated = trainingService.updateProgress(enrollmentId, dto.getProgressPercentage(), dto.isCompleted());
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<TrainingResponseDto>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('TALENT')")
    public ResponseEntity<List<TrainingEnrollmentDto>> getMyEnrollments(Authentication authentication) {
        Long talentUserId = SecurityUtil.getCurrentUserId(authentication, userRepository);
        return ResponseEntity.ok(trainingService.getMyEnrollments(talentUserId));
    }
}