package com.plethora.tpo.dto.admin;

import com.plethora.tpo.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean enabled;
    private Instant createdAt;

    private String department;
    private String rollNumber;
    private Double cgpa;
    private Integer graduationYear;
    private String phone;

    private String companyName;
    private String industry;
    private String website;
    private String contactPerson;
}
