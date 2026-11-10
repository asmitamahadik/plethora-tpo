package com.plethora.tpo.dto.hod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
public class HodResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String department;
    private String phone;
    private boolean enabled;
    private Instant createdAt;
}
