package com.plethora.tpo.repository;

import com.plethora.tpo.entity.Hod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HodRepository extends JpaRepository<Hod, Long> {
    Optional<Hod> findByUserId(Long userId);
}
