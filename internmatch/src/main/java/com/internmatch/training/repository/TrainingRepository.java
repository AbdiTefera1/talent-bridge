package com.internmatch.training.repository;

import com.internmatch.shared.enums.TrainingLevel;
import com.internmatch.training.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {

    List<Training> findByLevel(TrainingLevel level);

    List<Training> findByIsPaid(boolean isPaid);

    List<Training> findByCategory(String category);

    List<Training> findByCreatedById(Long createdById);
}