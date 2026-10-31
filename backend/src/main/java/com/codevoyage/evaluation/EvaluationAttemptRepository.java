package com.codevoyage.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationAttemptRepository extends JpaRepository<EvaluationAttempt, Long> {
    List<EvaluationAttempt> findByUserIdOrderBySubmittedAtAsc(Long userId);
    Optional<EvaluationAttempt> findFirstByUserIdAndTestTypeOrderBySubmittedAtAsc(Long userId, String testType);
    boolean existsByUserIdAndTestType(Long userId, String testType);
}
