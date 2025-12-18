package com.netbanking.repository;

import com.netbanking.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    boolean existsByAccount_IdAndLoanTypeAndStatus(
            Long accountId,
            String loanType,
            String status
    );

    List<Loan> findByAccount_Id(Long accountId);

    Optional<Loan> findByIdAndStatus(Long loanId, String status);
}
