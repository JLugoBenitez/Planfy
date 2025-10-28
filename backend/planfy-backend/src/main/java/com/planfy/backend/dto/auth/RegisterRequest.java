package com.planfy.backend.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private Boolean googleAuth = false;
    private String role;
}
