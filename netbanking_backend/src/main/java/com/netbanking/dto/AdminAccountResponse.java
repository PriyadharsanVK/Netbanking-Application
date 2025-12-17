package com.netbanking.dto;

import java.math.BigDecimal;

public class AdminAccountResponse {

    private Long id;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private Long userId;
    private String username;

    public AdminAccountResponse(
            Long id,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String status,
            Long userId,
            String username
    ) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.userId = userId;
        this.username = username;
    }

    // getters only
    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public String getStatus() { return status; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
}
