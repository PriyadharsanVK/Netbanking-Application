package com.netbanking.dto;

public class LoginResponse {

    private Long userId;
    private Long accountId;
    private String accountNumber;

    public LoginResponse(Long userId, Long accountId, String accountNumber) {
        this.userId = userId;
        this.accountId = accountId;
        this.accountNumber = accountNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}
