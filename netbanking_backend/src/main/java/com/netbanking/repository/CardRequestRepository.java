package com.netbanking.repository;

import com.netbanking.entity.CardRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRequestRepository extends JpaRepository<CardRequest, Long> {

    // Requests for a specific account
    List<CardRequest> findByAccount_Id(Long accountId);

    // Prevent multiple pending requests per account
    boolean existsByAccount_IdAndStatusAndCardType(
            Long accountId,
            String status,
            String cardType
    );

    // Admin view
    List<CardRequest> findByStatus(String status);
}