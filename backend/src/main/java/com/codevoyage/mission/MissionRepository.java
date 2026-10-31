package com.codevoyage.mission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    Optional<Mission> findBySlug(String slug);
    List<Mission> findByWorldIdOrderByMissionOrderAsc(Long worldId);
}
