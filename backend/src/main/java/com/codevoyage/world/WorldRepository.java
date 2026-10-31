package com.codevoyage.world;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorldRepository extends JpaRepository<World, Long> {
    Optional<World> findBySlug(String slug);
    List<World> findByCourseIdOrderByWorldOrderAsc(Long courseId);
}
