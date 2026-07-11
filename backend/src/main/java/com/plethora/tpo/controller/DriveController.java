package com.plethora.tpo.controller;

import com.plethora.tpo.dto.drive.DriveRequest;
import com.plethora.tpo.dto.drive.DriveResponse;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.CompanyService;
import com.plethora.tpo.service.DriveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
@RequiredArgsConstructor
public class DriveController {

    private final DriveService driveService;
    private final CompanyService companyService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TPO_ADMIN')")
    public List<DriveResponse> listDrives(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal.getRole().equals(Role.TPO_ADMIN.name())) {
            return driveService.findAll();
        }
        return driveService.findEligibleForStudent(principal.getId());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public List<DriveResponse> myDrives(@AuthenticationPrincipal UserPrincipal principal) {
        Long companyId = companyService.getProfileByUserId(principal.getId()).getId();
        return driveService.findByCompany(companyId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public DriveResponse getDrive(@PathVariable Long id) {
        return driveService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public DriveResponse createDrive(@AuthenticationPrincipal UserPrincipal principal,
                                       @Valid @RequestBody DriveRequest request) {
        return driveService.createDrive(currentUserProvider.resolve(principal), request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public DriveResponse updateDrive(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long id,
                                       @Valid @RequestBody DriveRequest request) {
        return driveService.updateDrive(id, currentUserProvider.resolve(principal), request);
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public DriveResponse publishDrive(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return driveService.publishDrive(id, currentUserProvider.resolve(principal));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public DriveResponse closeDrive(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return driveService.closeDrive(id, currentUserProvider.resolve(principal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public void deleteDrive(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        driveService.deleteDrive(id, currentUserProvider.resolve(principal));
    }
}
