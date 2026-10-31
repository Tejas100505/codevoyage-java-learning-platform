package com.codevoyage.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndMissionId(Long userId, Long missionId);
    List<UserProgress> findByUserId(Long userId);
    List<UserProgress> findByUserIdAndCompletedTrue(Long userId);
}
