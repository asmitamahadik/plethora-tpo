package com.plethora.tpo.service;

import com.plethora.tpo.dto.admin.AdminUserResponse;
import com.plethora.tpo.dto.admin.AdminUserUpdateRequest;
import com.plethora.tpo.dto.admin.PagedResponse;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.BadRequestException;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.CompanyRepository;
import com.plethora.tpo.repository.HodRepository;
import com.plethora.tpo.repository.StudentRepository;
import com.plethora.tpo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final HodRepository hodRepository;
    private final AuditLogService auditLogService;

    public PagedResponse<AdminUserResponse> search(Role role, String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size < 1 ? 10 : size, Sort.by("createdAt").descending());
        String emailFilter = StringUtils.hasText(search) ? search.trim() : null;

        Page<User> result;
        if (role != null && emailFilter != null) {
            result = userRepository.findByRoleAndEmailContainingIgnoreCase(role, emailFilter, pageable);
        } else if (role != null) {
            result = userRepository.findByRole(role, pageable);
        } else if (emailFilter != null) {
            result = userRepository.findByEmailContainingIgnoreCase(emailFilter, pageable);
        } else {
            result = userRepository.findAll(pageable);
        }

        return PagedResponse.<AdminUserResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    public AdminUserResponse getById(Long id) {
        return toResponse(findUser(id));
    }

    @Transactional
    public AdminUserResponse updateUser(Long id, User actingAdmin, AdminUserUpdateRequest request) {
        User user = findUser(id);

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        userRepository.save(user);

        switch (user.getRole()) {
            case STUDENT -> studentRepository.findByUserId(user.getId()).ifPresent(student -> {
                student.setFullName(request.getName());
                if (StringUtils.hasText(request.getDepartment())) {
                    student.setDepartment(request.getDepartment());
                }
                studentRepository.save(student);
            });
            case HOD -> hodRepository.findByUserId(user.getId()).ifPresent(hod -> {
                hod.setFullName(request.getName());
                if (StringUtils.hasText(request.getDepartment())) {
                    hod.setDepartment(request.getDepartment());
                }
                hodRepository.save(hod);
            });
            case COMPANY -> companyRepository.findByUserId(user.getId()).ifPresent(company -> {
                company.setCompanyName(request.getName());
                companyRepository.save(company);
            });
            case TPO_ADMIN -> {
                // TPO admins have no profile row to update; only status changes above apply.
            }
        }

        auditLogService.log(actingAdmin, "UPDATE_USER", "User", user.getId(),
                "TPO Admin updated user account: " + user.getEmail());

        return toResponse(findUser(id));
    }

    @Transactional
    public void disableUser(Long id, User actingAdmin) {
        if (actingAdmin.getId().equals(id)) {
            throw new BadRequestException("You cannot delete your own account");
        }
        User user = findUser(id);
        user.setEnabled(false);
        userRepository.save(user);

        auditLogService.log(actingAdmin, "DELETE_USER", "User", user.getId(),
                "TPO Admin disabled user account: " + user.getEmail());
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AdminUserResponse toResponse(User user) {
        AdminUserResponse.AdminUserResponseBuilder builder = AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt());

        switch (user.getRole()) {
            case STUDENT -> studentRepository.findByUserId(user.getId()).ifPresentOrElse(student -> {
                builder.name(student.getFullName())
                        .department(student.getDepartment())
                        .rollNumber(student.getRollNumber())
                        .cgpa(student.getCgpa())
                        .graduationYear(student.getGraduationYear())
                        .phone(student.getPhone());
            }, () -> builder.name(user.getEmail()));
            case HOD -> hodRepository.findByUserId(user.getId()).ifPresentOrElse(hod -> {
                builder.name(hod.getFullName())
                        .department(hod.getDepartment())
                        .phone(hod.getPhone());
            }, () -> builder.name(user.getEmail()));
            case COMPANY -> companyRepository.findByUserId(user.getId()).ifPresentOrElse(company -> {
                builder.name(company.getCompanyName())
                        .companyName(company.getCompanyName())
                        .industry(company.getIndustry())
                        .website(company.getWebsite())
                        .contactPerson(company.getContactPerson());
            }, () -> builder.name(user.getEmail()));
            case TPO_ADMIN -> builder.name("TPO Admin");
        }

        return builder.build();
    }
}
