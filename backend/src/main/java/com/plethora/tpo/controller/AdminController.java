package com.plethora.tpo.controller;

import com.plethora.tpo.dto.admin.AdminUserResponse;
import com.plethora.tpo.dto.admin.AdminUserUpdateRequest;
import com.plethora.tpo.dto.admin.PagedResponse;
import com.plethora.tpo.dto.company.CompanyProfileResponse;
import com.plethora.tpo.dto.company.CreateCompanyRequest;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.security.CurrentUserProvider;
import com.plethora.tpo.security.UserPrincipal;
import com.plethora.tpo.service.AdminUserService;
import com.plethora.tpo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final AdminUserService adminUserService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping("/api/admin/companies")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public CompanyProfileResponse createCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody CreateCompanyRequest request) {
        return authService.registerCompanyByAdmin(request, currentUserProvider.resolve(principal));
    }

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public PagedResponse<AdminUserResponse> listUsers(@RequestParam(required = false) Role role,
                                                         @RequestParam(required = false) String search,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return adminUserService.search(role, search, page, size);
    }

    @GetMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public AdminUserResponse getUser(@PathVariable Long id) {
        return adminUserService.getById(id);
    }

    @PutMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public AdminUserResponse updateUser(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long id,
                                          @Valid @RequestBody AdminUserUpdateRequest request) {
        return adminUserService.updateUser(id, currentUserProvider.resolve(principal), request);
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('TPO_ADMIN')")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        adminUserService.disableUser(id, currentUserProvider.resolve(principal));
        return ResponseEntity.noContent().build();
    }
}
