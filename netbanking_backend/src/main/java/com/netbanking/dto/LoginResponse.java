package com.netbanking.dto;

public class LoginResponse {
    private Long userId;
    private String role;

    public LoginResponse(Long userId, String role) {
        this.userId = userId;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}
