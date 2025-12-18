package com.netbanking.repository;

import com.netbanking.entity.Card;
import com.netbanking.entity.CardRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    // Get cards of a specific account
    List<Card> findByAccount_Id(Long accountId);

    // Prevent duplicate card types per account
    boolean existsByAccount_IdAndCardTypeAndStatus(
            Long accountId,
            String cardType,
            String status
    );
    List<Card> findByStatus(String status);

    boolean existsByIdAndStatus(Long id, String status);

}
