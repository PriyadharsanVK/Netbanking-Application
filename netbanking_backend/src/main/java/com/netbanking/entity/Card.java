package com.netbanking.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private String cardType; // DEBIT / CREDIT

    @Column(nullable = false)
    private String status; // PENDING // ACTIVE / BLOCKED

    @Column(nullable = false)
    private LocalDate expiryDate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

//    @PrePersist
//    protected void onCreate() {
//        this.createdAt = Instant.now();
//    }

    /* Getters & Setters */

    public Long getId() { return id; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public Instant getCreatedAt() { return createdAt; }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
