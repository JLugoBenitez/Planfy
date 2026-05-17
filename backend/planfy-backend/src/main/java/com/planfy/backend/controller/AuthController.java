package com.planfy.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planfy.backend.dto.auth.JwtAuthResponse;
import com.planfy.backend.dto.auth.LoginRequest;
import com.planfy.backend.dto.auth.RegisterRequest;
import com.planfy.backend.security.JwtService;
import com.planfy.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public JwtAuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public JwtAuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    @PostMapping("/refresh-token")
    public JwtAuthResponse refreshToken(@RequestParam String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);

        if (!jwtService.isTokenValid(refreshToken, email)) {
            throw new RuntimeException("Refresh token inválido o expirado");
        }

        String newAccessToken = jwtService.generateToken(email);
        return new JwtAuthResponse(newAccessToken, refreshToken);
    }
}
