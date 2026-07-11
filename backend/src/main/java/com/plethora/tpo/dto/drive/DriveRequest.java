package com.plethora.tpo.dto.drive;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DriveRequest {

    private Long companyId;

    @NotBlank
    private String title;

    @NotBlank
    private String jobDescription;

    private Double ctcPackage;

    @NotNull @DecimalMin("0.0") @DecimalMax("10.0")
    private Double minCgpa;

    @NotBlank
    private String allowedDepartments;

    @Min(0)
    private Integer maxBacklogs = 0;

    private LocalDate applicationDeadline;

    private LocalDate driveDate;
}
