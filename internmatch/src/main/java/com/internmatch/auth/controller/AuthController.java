package com.internmatch.auth.controller;

import com.internmatch.auth.dto.AuthResponse;
import com.internmatch.auth.dto.LoginRequest;
import com.internmatch.auth.dto.RegisterRequest;
import com.internmatch.auth.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login, register, token management")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        System.out.println(request.getEmail());
        System.out.println(request.getPassword());
        return ResponseEntity.ok(authService.login(request));
    }
}