package com.netbanking.repository;

import com.netbanking.entity.LoanRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {

    boolean existsByAccount_IdAndLoanTypeAndStatus(
            Long accountId,
            String loanType,
            String status
    );

    List<LoanRequest> findByStatus(String status);

    List<LoanRequest> findByAccount_Id(Long accountId);
}
