package com.plethora.tpo.controller;

import com.plethora.tpo.dto.application.ApplicationResponse;
import com.plethora.tpo.dto.application.StatusUpdateRequest;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping("/api/drives/{driveId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ApplicationResponse apply(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long driveId) {
        return applicationService.apply(currentUserProvider.resolve(principal), driveId);
    }

    @GetMapping("/api/applications/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<ApplicationResponse> myApplications(@AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.findForStudent(currentUserProvider.resolve(principal));
    }

    @GetMapping("/api/drives/{driveId}/applications")
    @PreAuthorize("hasAnyRole('TPO_ADMIN', 'COMPANY')")
    public List<ApplicationResponse> applicationsForDrive(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable Long driveId) {
        return applicationService.findForDrive(driveId, currentUserProvider.resolve(principal));
    }

    @PutMapping("/api/applications/{id}/status")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public ApplicationResponse updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long id,
                                              @Valid @RequestBody StatusUpdateRequest request) {
        return applicationService.updateStatus(id, currentUserProvider.resolve(principal), request);
    }

    @PutMapping("/api/applications/{id}/interview-status")
    @PreAuthorize("hasRole('COMPANY')")
    public ApplicationResponse updateInterviewStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                        @PathVariable Long id,
                                                        @Valid @RequestBody StatusUpdateRequest request) {
        return applicationService.updateStatus(id, currentUserProvider.resolve(principal), request);
    }
}
