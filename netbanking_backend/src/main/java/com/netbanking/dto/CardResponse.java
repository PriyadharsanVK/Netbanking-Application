package com.netbanking.dto;

import java.time.LocalDate;

public class CardResponse {

    private Long id;
    private String cardNumber;
    private String cardType;
    private String status;
    private LocalDate expiryDate;

    public CardResponse(Long id, String cardNumber, String cardType,
                        String status, LocalDate expiryDate) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.cardType = cardType;
        this.status = status;
        this.expiryDate = expiryDate;
    }

    public Long getId() { return id; }
    public String getCardNumber() { return cardNumber; }
    public String getCardType() { return cardType; }
    public String getStatus() { return status; }
    public LocalDate getExpiryDate() { return expiryDate; }
}
