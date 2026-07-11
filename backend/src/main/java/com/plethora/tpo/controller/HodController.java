package com.plethora.tpo.controller;

import com.plethora.tpo.dto.application.ApplicationResponse;
import com.plethora.tpo.dto.drive.DriveResponse;
import com.plethora.tpo.dto.hod.CreateHodRequest;
import com.plethora.tpo.dto.hod.HodResponse;
import com.plethora.tpo.dto.student.StudentProfileResponse;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.AuthService;
import com.plethora.tpo.service.HodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HodController {

    private final AuthService authService;
    private final HodService hodService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping("/api/admin/hods")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public HodResponse createHod(@AuthenticationPrincipal UserPrincipal principal,
                                   @Valid @RequestBody CreateHodRequest request) {
        return authService.registerHod(request, currentUserProvider.resolve(principal));
    }

    @GetMapping("/api/admin/hods")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public List<HodResponse> listHods() {
        return hodService.findAll();
    }

    @GetMapping("/api/hod/dashboard/students")
    @PreAuthorize("hasRole('HOD')")
    public List<StudentProfileResponse> departmentStudents(@AuthenticationPrincipal UserPrincipal principal) {
        return hodService.findStudentsInDepartment(hodService.getDepartmentForUser(principal.getId()));
    }

    @GetMapping("/api/hod/dashboard/drives")
    @PreAuthorize("hasRole('HOD')")
    public List<DriveResponse> departmentDrives(@AuthenticationPrincipal UserPrincipal principal) {
        return hodService.findDrivesForDepartment(hodService.getDepartmentForUser(principal.getId()));
    }

    @GetMapping("/api/hod/drives/{driveId}/applicants")
    @PreAuthorize("hasRole('HOD')")
    public List<ApplicationResponse> departmentApplicants(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable Long driveId) {
        return hodService.findApplicantsForDrive(driveId, hodService.getDepartmentForUser(principal.getId()));
    }
}
