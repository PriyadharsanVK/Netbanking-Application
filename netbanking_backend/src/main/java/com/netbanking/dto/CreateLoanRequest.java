package com.netbanking.dto;

import java.math.BigDecimal;

public class CreateLoanRequest {

    private Long accountId;
    private String loanType;
    private BigDecimal principalAmount;
    private Integer tenureMonths;

    public Long getAccountId() {
        return accountId;
    }

    public String getLoanType() {
        return loanType;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }
}
