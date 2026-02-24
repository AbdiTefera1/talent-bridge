package com.internmatch.training.repository;

import com.internmatch.training.entity.TrainingEnrollment;
import com.internmatch.user.entity.TalentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingEnrollmentRepository extends JpaRepository<TrainingEnrollment, Long> {

    Optional<TrainingEnrollment> findByTrainingIdAndTalentId(Long trainingId, Long talentId);

    List<TrainingEnrollment> findByTalentId(Long talentId);

    List<TrainingEnrollment> findByTrainingId(Long trainingId);

    long countByTrainingIdAndIsCompleted(Long trainingId, boolean isCompleted);
}