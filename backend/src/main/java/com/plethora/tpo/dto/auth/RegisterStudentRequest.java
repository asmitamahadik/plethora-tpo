package com.plethora.tpo.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterStudentRequest {

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String rollNumber;

    @NotBlank
    private String department;

    @NotNull @DecimalMin("0.0") @DecimalMax("10.0")
    private Double cgpa;

    @NotNull
    private Integer graduationYear;

    private String phone;

    @Min(0)
    private Integer backlogs = 0;

    private String skills;
}
