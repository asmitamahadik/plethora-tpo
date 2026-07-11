package com.plethora.tpo.controller;

import com.plethora.tpo.dto.auditlog.AuditLogResponse;
import com.plethora.tpo.entity.AuditLog;
import com.plethora.tpo.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public List<AuditLogResponse> listAuditLogs() {
        return auditLogService.findAll().stream().map(this::toResponse).toList();
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .actorEmail(log.getActor().getEmail())
                .actorRole(log.getActor().getRole().name())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}
