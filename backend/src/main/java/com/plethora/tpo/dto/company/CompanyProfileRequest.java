package com.plethora.tpo.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyProfileRequest {

    @NotBlank
    private String companyName;

    private String industry;

    private String website;

    private String contactPerson;

    private String description;
}
