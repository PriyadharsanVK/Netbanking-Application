package com.netbanking.dto;

import com.netbanking.enums.TransferType;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionResponse {

    private String type;                 // CREDIT / DEBIT
    private BigDecimal amount;
    private String description;
    private Instant createdAt;
    private String accountNumber;
    private BigDecimal balanceAfter;     // derived, not stored
    private TransferType transferType;   // SELF / NORMAL (null for deposit)

    public TransactionResponse(String type,
                               BigDecimal amount,
                               String description,
                               Instant createdAt,
                               String accountNumber,
                               BigDecimal balanceAfter,
                               TransferType transferType) {
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.createdAt = createdAt;
        this.accountNumber = accountNumber;
        this.balanceAfter = balanceAfter;
        this.transferType = transferType;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public TransferType getTransferType() {
        return transferType;
    }
}
