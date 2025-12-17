package com.netbanking.repository;

import com.netbanking.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    // Get cards of a specific account
    List<Card> findByAccount_Id(Long accountId);

    // Prevent duplicate card types per account
    boolean existsByAccount_IdAndCardType(Long accountId, String cardType);
}
