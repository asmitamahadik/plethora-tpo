package com.plethora.tpo.controller;

import com.plethora.tpo.dto.student.StudentProfileRequest;
import com.plethora.tpo.dto.student.StudentProfileResponse;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileResponse getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return studentService.getProfileByUserId(principal.getId());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileResponse updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                    @Valid @RequestBody StudentProfileRequest request) {
        return studentService.updateProfile(currentUserProvider.resolve(principal), request);
    }

    @GetMapping
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public List<StudentProfileResponse> listStudents() {
        return studentService.findAll();
    }
}
