package com.internmatch.training.service;

import com.internmatch.training.dto.TrainingCreateDto;
import com.internmatch.training.dto.TrainingEnrollmentDto;
import com.internmatch.training.dto.TrainingResponseDto;
import com.internmatch.training.entity.Training;
import com.internmatch.training.entity.TrainingEnrollment;
import com.internmatch.training.repository.TrainingEnrollmentRepository;
import com.internmatch.training.repository.TrainingRepository;
import com.internmatch.user.entity.TalentProfile;
import com.internmatch.user.entity.User;
import com.internmatch.user.repository.TalentProfileRepository;
import com.internmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingRepository trainingRepository;
    private final TrainingEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final TalentProfileRepository talentProfileRepository;

    @Transactional
    public TrainingResponseDto createTraining(Long creatorUserId, TrainingCreateDto dto) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Training training = new Training();
        training.setTitle(dto.getTitle());
        training.setDescription(dto.getDescription());
        training.setCategory(dto.getCategory());
        training.setLevel(dto.getLevel());
        training.setPaid(dto.isPaid());
        training.setPrice(dto.getPrice());
        training.setDurationHours(dto.getDurationHours());
        training.setContentUrl(dto.getContentUrl());
        training.setCreatedBy(creator);

        training = trainingRepository.save(training);
        return mapToTrainingResponse(training);
    }

    @Transactional
    public TrainingEnrollmentDto enrollInTraining(Long talentUserId, Long trainingId) {
        TalentProfile talent = talentProfileRepository.findByUserId(talentUserId)
                .orElseThrow(() -> new RuntimeException("Talent profile not found"));

        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (enrollmentRepository.findByTrainingIdAndTalentId(trainingId, talent.getId()).isPresent()) {
            throw new RuntimeException("Already enrolled in this training");
        }

        TrainingEnrollment enrollment = new TrainingEnrollment();
        enrollment.setTraining(training);
        enrollment.setTalent(talent);

        enrollment = enrollmentRepository.save(enrollment);
        return mapToEnrollmentResponse(enrollment);
    }

    @Transactional
    public TrainingEnrollmentDto updateProgress(Long enrollmentId, Integer progress, boolean completed) {
        TrainingEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (progress != null && progress >= 0 && progress <= 100) {
            enrollment.setProgressPercentage(progress);
        }

        if (completed) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        }

        enrollment = enrollmentRepository.save(enrollment);
        return mapToEnrollmentResponse(enrollment);
    }

    public List<TrainingResponseDto> getAllTrainings() {
        return trainingRepository.findAll().stream()
                .map(this::mapToTrainingResponse)
                .collect(Collectors.toList());
    }

    public List<TrainingEnrollmentDto> getMyEnrollments(Long talentUserId) {
        TalentProfile talent = talentProfileRepository.findByUserId(talentUserId)
                .orElseThrow(() -> new RuntimeException("Talent profile not found"));

        return enrollmentRepository.findByTalentId(talent.getId()).stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }

    private TrainingResponseDto mapToTrainingResponse(Training t) {
        TrainingResponseDto dto = new TrainingResponseDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        dto.setCategory(t.getCategory());
        dto.setLevel(t.getLevel());
        dto.setPaid(t.isPaid());
        dto.setPrice(t.getPrice());
        dto.setDurationHours(t.getDurationHours());
        dto.setCreatedById(t.getCreatedBy() != null ? t.getCreatedBy().getId() : null);
        dto.setCreatedByName(t.getCreatedBy() != null ? t.getCreatedBy().getFullName() : null);
        dto.setContentUrl(t.getContentUrl());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setUpdatedAt(t.getUpdatedAt());
        return dto;
    }

    private TrainingEnrollmentDto mapToEnrollmentResponse(TrainingEnrollment e) {
        TrainingEnrollmentDto dto = new TrainingEnrollmentDto();
        dto.setId(e.getId());
        dto.setTrainingId(e.getTraining().getId());
        dto.setTrainingTitle(e.getTraining().getTitle());
        dto.setTalentId(e.getTalent().getId());
        dto.setTalentName(e.getTalent().getUser().getFullName());
        dto.setProgressPercentage(e.getProgressPercentage());
        dto.setCompleted(e.isCompleted());
        dto.setEnrolledAt(e.getEnrolledAt());
        dto.setCompletedAt(e.getCompletedAt());
        return dto;
    }
}