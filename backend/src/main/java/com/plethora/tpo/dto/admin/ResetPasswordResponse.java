package com.plethora.tpo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ResetPasswordResponse {
    private String password;
}
