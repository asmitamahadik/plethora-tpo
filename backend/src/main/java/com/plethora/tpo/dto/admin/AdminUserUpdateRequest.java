package com.plethora.tpo.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {

    @NotBlank
    private String name;

    private String department;

    private Boolean enabled;
}
