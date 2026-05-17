package com.planfy.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.planfy.backend.dto.auth.JwtAuthResponse;
import com.planfy.backend.dto.auth.LoginRequest;
import com.planfy.backend.dto.auth.RegisterRequest;
import com.planfy.backend.model.Role;
import com.planfy.backend.model.User;
import com.planfy.backend.repository.RoleRepository;
import com.planfy.backend.repository.UserRepository;
import com.planfy.backend.security.JwtService;

@Service
public class AuthService {

    @Autowired 
    private UserRepository userRepository;

    @Autowired 
    private RoleRepository roleRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @Autowired 
    private JwtService jwtService;

    public JwtAuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese email ya está registrado");
        }

        Role roleEntity = roleRepository.findByName(request.getRole())
            .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));

        User user = User.builder()
            .nombre(request.getNombre())
            .email(email)
            .password(passwordEncoder.encode(request.getPassword()))
            .googleAuth(request.getGoogleAuth())
            .role(roleEntity)
            .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new JwtAuthResponse(token, refreshToken);
    }

    public JwtAuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        return new JwtAuthResponse(
                jwtService.generateToken(user.getEmail()),
                jwtService.generateRefreshToken(user.getEmail())
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
