package com.plethora.tpo.service;

import com.plethora.tpo.entity.AuditLog;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User actor, String action, String entityType, Long entityId, String details) {
        AuditLog entry = AuditLog.builder()
                .actor(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }

    public List<AuditLog> findAll() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
