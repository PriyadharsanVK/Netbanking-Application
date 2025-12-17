package com.netbanking.dto;

public class CreateCardRequest {

    private Long accountId;     // user selects account
    private String cardType;    // DEBIT / CREDIT

    public Long getAccountId() {
        return accountId;
    }

    public String getCardType() {
        return cardType;
    }
}
