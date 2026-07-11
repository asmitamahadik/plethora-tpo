package com.plethora.tpo.service;

import com.plethora.tpo.dto.student.StudentProfileRequest;
import com.plethora.tpo.dto.student.StudentProfileResponse;
import com.plethora.tpo.entity.Student;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final AuditLogService auditLogService;

    public StudentProfileResponse getProfileByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return toResponse(student);
    }

    @Transactional
    public StudentProfileResponse updateProfile(User actor, StudentProfileRequest request) {
        Student student = studentRepository.findByUserId(actor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        student.setFullName(request.getFullName());
        student.setDepartment(request.getDepartment());
        student.setCgpa(request.getCgpa());
        student.setGraduationYear(request.getGraduationYear());
        student.setPhone(request.getPhone());
        student.setResumeUrl(request.getResumeUrl());
        student.setBacklogs(request.getBacklogs() == null ? 0 : request.getBacklogs());
        student.setSkills(request.getSkills());
        studentRepository.save(student);

        auditLogService.log(actor, "UPDATE_PROFILE", "Student", student.getId(), "Student updated their profile");

        return toResponse(student);
    }

    public List<StudentProfileResponse> findAll() {
        return studentRepository.findAll().stream().map(this::toResponse).toList();
    }

    Student getEntityByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    private StudentProfileResponse toResponse(Student student) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .email(student.getUser().getEmail())
                .fullName(student.getFullName())
                .rollNumber(student.getRollNumber())
                .department(student.getDepartment())
                .cgpa(student.getCgpa())
                .graduationYear(student.getGraduationYear())
                .phone(student.getPhone())
                .resumeUrl(student.getResumeUrl())
                .backlogs(student.getBacklogs())
                .skills(student.getSkills())
                .build();
    }
}
