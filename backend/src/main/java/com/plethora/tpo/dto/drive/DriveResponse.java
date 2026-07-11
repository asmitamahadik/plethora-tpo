package com.plethora.tpo.dto.drive;

import com.plethora.tpo.entity.DriveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class DriveResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private String title;
    private String jobDescription;
    private Double ctcPackage;
    private Double minCgpa;
    private String allowedDepartments;
    private Integer maxBacklogs;
    private LocalDate applicationDeadline;
    private LocalDate driveDate;
    private DriveStatus status;
    private Instant createdAt;
}
