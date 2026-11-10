package com.plethora.tpo.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
public class CompanyProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String companyName;
    private String industry;
    private String website;
    private String contactPerson;
    private String description;
    private boolean enabled;
    private Instant createdAt;
}
