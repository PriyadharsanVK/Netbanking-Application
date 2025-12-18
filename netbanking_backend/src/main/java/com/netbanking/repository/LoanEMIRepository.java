package com.netbanking.repository;

import com.netbanking.entity.LoanEMI;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanEMIRepository extends JpaRepository<LoanEMI, Long> {

    List<LoanEMI> findByLoan_IdOrderByEmiNumberAsc(Long loanId);

    Optional<LoanEMI> findFirstByLoan_IdAndStatusOrderByEmiNumberAsc(
            Long loanId,
            String status
    );

    boolean existsByLoan_IdAndStatus(Long loanId, String status);
}
