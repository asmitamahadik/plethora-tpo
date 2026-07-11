package com.plethora.tpo.service;

import com.plethora.tpo.dto.application.ApplicationResponse;
import com.plethora.tpo.dto.application.StatusUpdateRequest;
import com.plethora.tpo.entity.Application;
import com.plethora.tpo.entity.ApplicationStatus;
import com.plethora.tpo.entity.DriveStatus;
import com.plethora.tpo.entity.PlacementDrive;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.entity.Student;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.BadRequestException;
import com.plethora.tpo.exception.ResourceNotFoundException;
import com.plethora.tpo.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentService studentService;
    private final DriveService driveService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse apply(User actor, Long driveId) {
        Student student = studentService.getEntityByUserId(actor.getId());
        PlacementDrive drive = driveService.getEntityById(driveId);

        if (drive.getStatus() != DriveStatus.PUBLISHED) {
            throw new BadRequestException("This drive is not currently open for applications");
        }
        if (drive.getApplicationDeadline() != null && drive.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline for this drive has passed");
        }
        if (applicationRepository.existsByDriveIdAndStudentId(driveId, student.getId())) {
            throw new BadRequestException("You have already applied to this drive");
        }
        if (!EligibilityChecker.isEligible(student, drive)) {
            throw new BadRequestException("You do not meet the eligibility criteria for this drive");
        }

        Application application = Application.builder()
                .drive(drive)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .build();
        applicationRepository.save(application);

        auditLogService.log(actor, "APPLY", "Application", application.getId(),
                student.getFullName() + " applied to drive '" + drive.getTitle() + "'");
        notificationService.notify(drive.getCompany().getUser(), "NEW_APPLICATION",
                student.getFullName() + " applied to your drive '" + drive.getTitle() + "'");

        return toResponse(application);
    }

    public List<ApplicationResponse> findForStudent(User actor) {
        Student student = studentService.getEntityByUserId(actor.getId());
        return applicationRepository.findByStudentId(student.getId()).stream().map(this::toResponse).toList();
    }

    public List<ApplicationResponse> findForDrive(Long driveId, User actor) {
        driveService.requireManageable(driveId, actor);
        return applicationRepository.findByDriveId(driveId).stream().map(this::toResponse).toList();
    }

    public List<ApplicationResponse> findForDriveUnrestricted(Long driveId) {
        driveService.getEntityById(driveId);
        return applicationRepository.findByDriveId(driveId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, User actor, StatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        assertCanManage(actor, application);

        application.setStatus(request.getStatus());
        application.setRemarks(request.getRemarks());
        applicationRepository.save(application);

        auditLogService.log(actor, "UPDATE_APPLICATION_STATUS", "Application", application.getId(),
                "Status changed to " + request.getStatus() + (request.getRemarks() != null ? " (" + request.getRemarks() + ")" : ""));
        notificationService.notify(application.getStudent().getUser(), "APPLICATION_STATUS_CHANGED",
                "Your application to '" + application.getDrive().getTitle() + "' is now " + request.getStatus());

        return toResponse(application);
    }

    private void assertCanManage(User actor, Application application) {
        if (actor.getRole() == Role.TPO_ADMIN) {
            return;
        }
        if (actor.getRole() == Role.COMPANY
                && application.getDrive().getCompany().getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new AccessDeniedException("Not authorized to manage this application");
    }

    private ApplicationResponse toResponse(Application application) {
        Student student = application.getStudent();
        PlacementDrive drive = application.getDrive();
        return ApplicationResponse.builder()
                .id(application.getId())
                .driveId(drive.getId())
                .driveTitle(drive.getTitle())
                .companyName(drive.getCompany().getCompanyName())
                .studentId(student.getId())
                .studentName(student.getFullName())
                .rollNumber(student.getRollNumber())
                .cgpa(student.getCgpa())
                .status(application.getStatus())
                .remarks(application.getRemarks())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
