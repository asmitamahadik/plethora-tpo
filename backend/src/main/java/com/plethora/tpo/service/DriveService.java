package com.plethora.tpo.service;

import com.plethora.tpo.dto.drive.DriveRequest;
import com.plethora.tpo.dto.drive.DriveResponse;
import com.plethora.tpo.entity.Company;
import com.plethora.tpo.entity.DriveStatus;
import com.plethora.tpo.entity.PlacementDrive;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.entity.Student;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.BadRequestException;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.PlacementDriveRepository;
import com.plethora.tpo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DriveService {

    private final PlacementDriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final CompanyService companyService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional
    public DriveResponse createDrive(User actor, DriveRequest request) {
        Company company = resolveCompanyForActor(actor, request.getCompanyId());

        PlacementDrive drive = PlacementDrive.builder()
                .company(company)
                .createdBy(actor)
                .title(request.getTitle())
                .jobDescription(request.getJobDescription())
                .ctcPackage(request.getCtcPackage())
                .minCgpa(request.getMinCgpa())
                .allowedDepartments(request.getAllowedDepartments())
                .maxBacklogs(request.getMaxBacklogs() == null ? 0 : request.getMaxBacklogs())
                .applicationDeadline(request.getApplicationDeadline())
                .driveDate(request.getDriveDate())
                .status(DriveStatus.DRAFT)
                .build();
        driveRepository.save(drive);

        auditLogService.log(actor, "CREATE_DRIVE", "PlacementDrive", drive.getId(),
                "Created drive '" + drive.getTitle() + "' for " + company.getCompanyName());

        return toResponse(drive);
    }

    @Transactional
    public DriveResponse updateDrive(Long driveId, User actor, DriveRequest request) {
        PlacementDrive drive = getEntityById(driveId);
        assertCanManage(actor, drive);

        drive.setTitle(request.getTitle());
        drive.setJobDescription(request.getJobDescription());
        drive.setCtcPackage(request.getCtcPackage());
        drive.setMinCgpa(request.getMinCgpa());
        drive.setAllowedDepartments(request.getAllowedDepartments());
        drive.setMaxBacklogs(request.getMaxBacklogs() == null ? 0 : request.getMaxBacklogs());
        drive.setApplicationDeadline(request.getApplicationDeadline());
        drive.setDriveDate(request.getDriveDate());
        driveRepository.save(drive);

        auditLogService.log(actor, "UPDATE_DRIVE", "PlacementDrive", drive.getId(),
                "Updated eligibility/details for drive '" + drive.getTitle() + "'");

        return toResponse(drive);
    }

    @Transactional
    public DriveResponse publishDrive(Long driveId, User actor) {
        PlacementDrive drive = getEntityById(driveId);
        assertCanManage(actor, drive);

        drive.setStatus(DriveStatus.PUBLISHED);
        driveRepository.save(drive);

        auditLogService.log(actor, "PUBLISH_DRIVE", "PlacementDrive", drive.getId(),
                "Published drive '" + drive.getTitle() + "'");

        for (Student student : studentRepository.findAll()) {
            if (EligibilityChecker.isEligible(student, drive)) {
                notificationService.notify(student.getUser(), "DRIVE_PUBLISHED",
                        "New placement drive '" + drive.getTitle() + "' from " + drive.getCompany().getCompanyName()
                                + " is open — you're eligible to apply.");
            }
        }

        return toResponse(drive);
    }

    @Transactional
    public DriveResponse closeDrive(Long driveId, User actor) {
        PlacementDrive drive = getEntityById(driveId);
        assertCanManage(actor, drive);

        drive.setStatus(DriveStatus.CLOSED);
        driveRepository.save(drive);

        auditLogService.log(actor, "CLOSE_DRIVE", "PlacementDrive", drive.getId(),
                "Closed drive '" + drive.getTitle() + "'");

        return toResponse(drive);
    }

    @Transactional
    public void deleteDrive(Long driveId, User actor) {
        PlacementDrive drive = getEntityById(driveId);
        assertCanManage(actor, drive);
        driveRepository.delete(drive);
        auditLogService.log(actor, "DELETE_DRIVE", "PlacementDrive", driveId,
                "Deleted drive '" + drive.getTitle() + "'");
    }

    public DriveResponse getById(Long driveId) {
        return toResponse(getEntityById(driveId));
    }

    public List<DriveResponse> findAll() {
        return driveRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<DriveResponse> findByCompany(Long companyId) {
        return driveRepository.findByCompanyId(companyId).stream().map(this::toResponse).toList();
    }

    public List<DriveResponse> findEligibleForStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return driveRepository.findByStatus(DriveStatus.PUBLISHED).stream()
                .filter(drive -> EligibilityChecker.isEligible(student, drive))
                .map(this::toResponse)
                .toList();
    }

    PlacementDrive getEntityById(Long driveId) {
        return driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement drive not found"));
    }

    PlacementDrive requireManageable(Long driveId, User actor) {
        PlacementDrive drive = getEntityById(driveId);
        assertCanManage(actor, drive);
        return drive;
    }

    private Company resolveCompanyForActor(User actor, Long requestedCompanyId) {
        if (actor.getRole() == Role.COMPANY) {
            return companyService.getEntityByUserId(actor.getId());
        }
        if (requestedCompanyId == null) {
            throw new BadRequestException("companyId is required when a TPO admin creates a drive");
        }
        return companyService.getEntityById(requestedCompanyId);
    }

    private void assertCanManage(User actor, PlacementDrive drive) {
        if (actor.getRole() == Role.TPO_ADMIN) {
            return;
        }
        if (actor.getRole() == Role.COMPANY && drive.getCompany().getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new AccessDeniedException("Not authorized to manage this drive");
    }

    private DriveResponse toResponse(PlacementDrive drive) {
        return DriveResponse.builder()
                .id(drive.getId())
                .companyId(drive.getCompany().getId())
                .companyName(drive.getCompany().getCompanyName())
                .title(drive.getTitle())
                .jobDescription(drive.getJobDescription())
                .ctcPackage(drive.getCtcPackage())
                .minCgpa(drive.getMinCgpa())
                .allowedDepartments(drive.getAllowedDepartments())
                .maxBacklogs(drive.getMaxBacklogs())
                .applicationDeadline(drive.getApplicationDeadline())
                .driveDate(drive.getDriveDate())
                .status(drive.getStatus())
                .createdAt(drive.getCreatedAt())
                .build();
    }
}
