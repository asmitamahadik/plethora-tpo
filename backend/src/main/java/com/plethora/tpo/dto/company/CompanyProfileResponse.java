package com.plethora.tpo.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CompanyProfileResponse {
    private Long id;
    private String email;
    private String companyName;
    private String industry;
    private String website;
    private String contactPerson;
    private String description;
}
