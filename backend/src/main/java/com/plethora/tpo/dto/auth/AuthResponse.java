package com.plethora.tpo.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String role;
    private String displayName;
}
