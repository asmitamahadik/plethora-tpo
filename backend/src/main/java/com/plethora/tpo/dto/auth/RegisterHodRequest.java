package com.plethora.tpo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterHodRequest {

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String department;

    private String phone;

    @NotBlank
    private String inviteCode;
}
