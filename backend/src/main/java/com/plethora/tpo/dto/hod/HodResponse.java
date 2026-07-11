package com.plethora.tpo.dto.hod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class HodResponse {
    private Long id;
    private String email;
    private String fullName;
    private String department;
    private String phone;
}
