package com.plethora.tpo.dto.application;

import com.plethora.tpo.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long driveId;
    private String driveTitle;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Double cgpa;
    private ApplicationStatus status;
    private String remarks;
    private Instant appliedAt;
    private Instant updatedAt;
}
