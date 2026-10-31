package com.codevoyage.auth;

import com.codevoyage.auth.dto.AuthResponse;
import com.codevoyage.auth.dto.LoginRequest;
import com.codevoyage.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/api/auth/register", "/api/v1/auth/register"})
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping({"/api/auth/login", "/api/v1/auth/login"})
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping({"/api/auth/logout", "/api/v1/auth/logout"})
    public ResponseEntity<Map<String, String>> logout() {
        // Stateless JWT logout acknowledgment
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Sub-space communication link terminated. Session logged out."
        ));
    }
}
