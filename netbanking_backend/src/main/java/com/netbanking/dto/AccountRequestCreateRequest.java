package com.netbanking.dto;

public class AccountRequestCreateRequest {

    private Long userId;
    private String fullName;
    private String phone;
    private String address;
    private String accountType; // SAVINGS / CURRENT

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getAccountType() {
        return accountType;
    }
}
