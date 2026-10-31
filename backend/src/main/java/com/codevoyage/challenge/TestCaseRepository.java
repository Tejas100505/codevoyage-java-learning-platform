package com.codevoyage.challenge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByChallengeId(Long challengeId);
    List<TestCase> findByChallengeIdAndHiddenFalse(Long challengeId);
}
