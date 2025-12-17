package com.netbanking.dto;

import java.time.Instant;

public class AccountRequestUserResponse {

    private Long id;
    private String accountType;
    private String status;
    private Instant createdAt;

    public AccountRequestUserResponse(
            Long id,
            String accountType,
            String status,
            Instant createdAt
    ) {
        this.id = id;
        this.accountType = accountType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getAccountType() { return accountType; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
