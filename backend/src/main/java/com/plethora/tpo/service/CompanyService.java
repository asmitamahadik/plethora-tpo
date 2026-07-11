package com.plethora.tpo.service;

import com.plethora.tpo.dto.company.CompanyProfileRequest;
import com.plethora.tpo.dto.company.CompanyProfileResponse;
import com.plethora.tpo.entity.Company;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final AuditLogService auditLogService;

    public CompanyProfileResponse getProfileByUserId(Long userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return toResponse(company);
    }

    @Transactional
    public CompanyProfileResponse updateProfile(User actor, CompanyProfileRequest request) {
        Company company = companyRepository.findByUserId(actor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        company.setCompanyName(request.getCompanyName());
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setContactPerson(request.getContactPerson());
        company.setDescription(request.getDescription());
        companyRepository.save(company);

        auditLogService.log(actor, "UPDATE_PROFILE", "Company", company.getId(), "Company updated their profile");

        return toResponse(company);
    }

    public List<CompanyProfileResponse> findAll() {
        return companyRepository.findAll().stream().map(this::toResponse).toList();
    }

    Company getEntityByUserId(Long userId) {
        return companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
    }

    Company getEntityById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }

    private CompanyProfileResponse toResponse(Company company) {
        return CompanyProfileResponse.builder()
                .id(company.getId())
                .email(company.getUser().getEmail())
                .companyName(company.getCompanyName())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .contactPerson(company.getContactPerson())
                .description(company.getDescription())
                .build();
    }
}
