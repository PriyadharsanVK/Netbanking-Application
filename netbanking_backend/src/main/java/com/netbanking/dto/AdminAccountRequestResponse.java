package com.netbanking.dto;

import java.time.Instant;

public class AdminAccountRequestResponse {

    private Long requestId;
    private String username;
    private String fullName;
    private String phone;
    private String address;
    private String accountType;
    private String status;
    private Instant createdAt;

    public AdminAccountRequestResponse(
            Long requestId,
            String username,
            String fullName,
            String phone,
            String address,
            String accountType,
            String status,
            Instant createdAt
    ) {
        this.requestId = requestId;
        this.username = username;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.accountType = accountType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getRequestId() { return requestId; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getAccountType() { return accountType; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
