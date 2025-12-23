package com.netbanking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

public class AdminAccountResponse {

    private Long accountId;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private Instant createdAt;

    public AdminAccountResponse(
            Long accountId,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String status,
            Instant createdAt
    ) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
