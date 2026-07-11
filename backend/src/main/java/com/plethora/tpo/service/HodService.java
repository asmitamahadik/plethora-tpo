package com.plethora.tpo.service;

import com.plethora.tpo.dto.application.ApplicationResponse;
import com.plethora.tpo.dto.drive.DriveResponse;
import com.plethora.tpo.dto.hod.HodResponse;
import com.plethora.tpo.dto.student.StudentProfileResponse;
import com.plethora.tpo.entity.Hod;
import com.plethora.tpo.entity.Student;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.HodRepository;
import com.plethora.tpo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HodService {

    private final HodRepository hodRepository;
    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final DriveService driveService;
    private final ApplicationService applicationService;

    public String getDepartmentForUser(Long userId) {
        return hodRepository.findByUserId(userId)
                .map(Hod::getDepartment)
                .orElseThrow(() -> new ResourceNotFoundException("HOD profile not found"));
    }

    public List<StudentProfileResponse> findStudentsInDepartment(String department) {
        return studentService.findAll().stream()
                .filter(s -> department.equalsIgnoreCase(s.getDepartment()))
                .toList();
    }

    public List<DriveResponse> findDrivesForDepartment(String department) {
        return driveService.findAll().stream()
                .filter(drive -> matchesDepartment(drive.getAllowedDepartments(), department))
                .toList();
    }

    public List<ApplicationResponse> findApplicantsForDrive(Long driveId, String department) {
        Set<Long> studentIdsInDepartment = studentRepository.findAll().stream()
                .filter(s -> department.equalsIgnoreCase(s.getDepartment()))
                .map(Student::getId)
                .collect(Collectors.toSet());
        return applicationService.findForDriveUnrestricted(driveId).stream()
                .filter(application -> studentIdsInDepartment.contains(application.getStudentId()))
                .toList();
    }

    public List<HodResponse> findAll() {
        return hodRepository.findAll().stream().map(this::toResponse).toList();
    }

    private boolean matchesDepartment(String allowedDepartments, String department) {
        if ("ALL".equalsIgnoreCase(allowedDepartments)) {
            return true;
        }
        return Arrays.stream(allowedDepartments.split(","))
                .map(String::trim)
                .anyMatch(dept -> dept.equalsIgnoreCase(department));
    }

    private HodResponse toResponse(Hod hod) {
        return HodResponse.builder()
                .id(hod.getId())
                .email(hod.getUser().getEmail())
                .fullName(hod.getFullName())
                .department(hod.getDepartment())
                .phone(hod.getPhone())
                .build();
    }
}
