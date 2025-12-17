package com.netbanking.dto;

public class LoginResponse {
    private Long userId;

    public LoginResponse(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}
