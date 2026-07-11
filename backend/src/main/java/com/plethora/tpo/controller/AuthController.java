package com.plethora.tpo.controller;

import com.plethora.tpo.dto.auth.AuthResponse;
import com.plethora.tpo.dto.auth.LoginRequest;
import com.plethora.tpo.dto.auth.RegisterCompanyRequest;
import com.plethora.tpo.dto.auth.RegisterHodRequest;
import com.plethora.tpo.dto.auth.RegisterStudentRequest;
import com.plethora.tpo.dto.auth.RegisterTpoRequest;
import com.plethora.tpo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/register/company")
    public ResponseEntity<AuthResponse> registerCompany(@Valid @RequestBody RegisterCompanyRequest request) {
        return ResponseEntity.ok(authService.registerCompany(request));
    }

    @PostMapping("/register/tpo")
    public ResponseEntity<AuthResponse> registerTpo(@Valid @RequestBody RegisterTpoRequest request) {
        return ResponseEntity.ok(authService.registerTpoAdmin(request));
    }

    @PostMapping("/register/hod")
    public ResponseEntity<AuthResponse> registerHod(@Valid @RequestBody RegisterHodRequest request) {
        return ResponseEntity.ok(authService.registerHodSelf(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
