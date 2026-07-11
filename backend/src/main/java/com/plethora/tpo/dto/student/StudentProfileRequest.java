package com.plethora.tpo.dto.student;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentProfileRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String department;

    @NotNull @DecimalMin("0.0") @DecimalMax("10.0")
    private Double cgpa;

    @NotNull
    private Integer graduationYear;

    private String phone;

    private String resumeUrl;

    @Min(0)
    private Integer backlogs;

    private String skills;
}
