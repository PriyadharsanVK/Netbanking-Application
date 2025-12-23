package com.netbanking.repository;

import com.netbanking.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByUserIdAndActiveTrue(Long accountId);

    boolean existsByUserIdAndAccountNumber(Long userId, String accountNumber);
    boolean existsByUserIdAndAccountNumberAndActiveTrue(
            Long userId,
            String accountNumber
    );

}
