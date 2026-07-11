package com.plethora.tpo.service;

import com.plethora.tpo.dto.auth.AuthResponse;
import com.plethora.tpo.dto.auth.LoginRequest;
import com.plethora.tpo.dto.auth.RegisterCompanyRequest;
import com.plethora.tpo.dto.auth.RegisterHodRequest;
import com.plethora.tpo.dto.auth.RegisterStudentRequest;
import com.plethora.tpo.dto.auth.RegisterTpoRequest;
import com.plethora.tpo.dto.hod.CreateHodRequest;
import com.plethora.tpo.dto.hod.HodResponse;
import com.plethora.tpo.entity.Company;
import com.plethora.tpo.entity.Hod;
import com.plethora.tpo.entity.Role;
import com.plethora.tpo.entity.Student;
import com.plethora.tpo.entity.User;
import com.plethora.tpo.exception.BadRequestException;
import com.plethora.tpo.repository.CompanyRepository;
import com.plethora.tpo.repository.HodRepository;
import com.plethora.tpo.repository.StudentRepository;
import com.plethora.tpo.repository.UserRepository;
import com.plethora.tpo.security.JwtUtil;
import com.plethora.tpo.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final HodRepository hodRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;

    @Value("${app.invite-codes.tpo}")
    private String tpoInviteCode;

    @Value("${app.invite-codes.hod}")
    private String hodInviteCode;

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("A student with this roll number already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .fullName(request.getFullName())
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .cgpa(request.getCgpa())
                .graduationYear(request.getGraduationYear())
                .phone(request.getPhone())
                .backlogs(request.getBacklogs() == null ? 0 : request.getBacklogs())
                .skills(request.getSkills())
                .build();
        studentRepository.save(student);

        auditLogService.log(user, "REGISTER", "Student", student.getId(), "Student self-registered: " + student.getFullName());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .displayName(student.getFullName())
                .build();
    }

    @Transactional
    public AuthResponse registerCompany(RegisterCompanyRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.COMPANY)
                .build();
        user = userRepository.save(user);

        Company company = Company.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .contactPerson(request.getContactPerson())
                .description(request.getDescription())
                .build();
        companyRepository.save(company);

        auditLogService.log(user, "REGISTER", "Company", company.getId(), "Company self-registered: " + company.getCompanyName());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .displayName(company.getCompanyName())
                .build();
    }

    @Transactional
    public AuthResponse registerTpoAdmin(RegisterTpoRequest request) {
        if (!tpoInviteCode.equals(request.getInviteCode())) {
            throw new BadRequestException("Invalid invite code");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.TPO_ADMIN)
                .build();
        user = userRepository.save(user);

        auditLogService.log(user, "REGISTER", "User", user.getId(), "TPO Admin self-registered: " + user.getEmail());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .displayName("TPO Admin")
                .build();
    }

    @Transactional
    public AuthResponse registerHodSelf(RegisterHodRequest request) {
        if (!hodInviteCode.equals(request.getInviteCode())) {
            throw new BadRequestException("Invalid invite code");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.HOD)
                .build();
        user = userRepository.save(user);

        Hod hod = Hod.builder()
                .user(user)
                .fullName(request.getFullName())
                .department(request.getDepartment())
                .phone(request.getPhone())
                .build();
        hodRepository.save(hod);

        auditLogService.log(user, "REGISTER", "Hod", hod.getId(), "HOD self-registered: " + hod.getFullName() + " (" + hod.getDepartment() + ")");

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .displayName(hod.getFullName())
                .build();
    }

    @Transactional
    public HodResponse registerHod(CreateHodRequest request, User actingAdmin) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.HOD)
                .build();
        user = userRepository.save(user);

        Hod hod = Hod.builder()
                .user(user)
                .fullName(request.getFullName())
                .department(request.getDepartment())
                .phone(request.getPhone())
                .build();
        hodRepository.save(hod);

        auditLogService.log(actingAdmin, "CREATE_HOD", "Hod", hod.getId(),
                "TPO Admin created HOD account: " + hod.getFullName() + " (" + hod.getDepartment() + ")");

        return HodResponse.builder()
                .id(hod.getId())
                .email(user.getEmail())
                .fullName(hod.getFullName())
                .department(hod.getDepartment())
                .phone(hod.getPhone())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String displayName = switch (user.getRole()) {
            case STUDENT -> studentRepository.findByUserId(user.getId())
                    .map(Student::getFullName).orElse(user.getEmail());
            case COMPANY -> companyRepository.findByUserId(user.getId())
                    .map(Company::getCompanyName).orElse(user.getEmail());
            case TPO_ADMIN -> "TPO Admin";
            case HOD -> hodRepository.findByUserId(user.getId())
                    .map(Hod::getFullName).orElse(user.getEmail());
        };

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .displayName(displayName)
                .build();
    }
}
