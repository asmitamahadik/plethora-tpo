package com.plethora.tpo.repository;

import com.plethora.tpo.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    java.util.List<AuditLog> findAllByOrderByTimestampDesc();
}
