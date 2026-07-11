package com.plethora.tpo.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String rollNumber;
    private String department;
    private Double cgpa;
    private Integer graduationYear;
    private String phone;
    private String resumeUrl;
    private Integer backlogs;
    private String skills;
}
