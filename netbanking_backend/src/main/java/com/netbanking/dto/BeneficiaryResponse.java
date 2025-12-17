package com.netbanking.dto;

import java.time.Instant;

public class BeneficiaryResponse {

    private Long id;
    private String name;
    private String accountNumber;
    private Instant createdAt;

    public BeneficiaryResponse(
            Long id,
            String name,
            String accountNumber,
            Instant createdAt
    ) {
        this.id = id;
        this.name = name;
        this.accountNumber = accountNumber;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAccountNumber() { return accountNumber; }
    public Instant getCreatedAt() { return createdAt; }
}
