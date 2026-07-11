package com.plethora.tpo.repository;

import com.plethora.tpo.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByDriveId(Long driveId);
    Optional<Application> findByDriveIdAndStudentId(Long driveId, Long studentId);
    boolean existsByDriveIdAndStudentId(Long driveId, Long studentId);
}
