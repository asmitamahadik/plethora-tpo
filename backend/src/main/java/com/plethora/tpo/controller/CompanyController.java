package com.plethora.tpo.controller;

import com.plethora.tpo.dto.company.CompanyProfileRequest;
import com.plethora.tpo.dto.company.CompanyProfileResponse;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfileResponse getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return companyService.getProfileByUserId(principal.getId());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfileResponse updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                    @Valid @RequestBody CompanyProfileRequest request) {
        return companyService.updateProfile(currentUserProvider.resolve(principal), request);
    }

    @GetMapping
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public List<CompanyProfileResponse> listCompanies() {
        return companyService.findAll();
    }
}
