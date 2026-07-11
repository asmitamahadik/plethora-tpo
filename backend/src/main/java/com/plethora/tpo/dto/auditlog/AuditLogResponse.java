package com.plethora.tpo.dto.auditlog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String actorEmail;
    private String actorRole;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private Instant timestamp;
}
