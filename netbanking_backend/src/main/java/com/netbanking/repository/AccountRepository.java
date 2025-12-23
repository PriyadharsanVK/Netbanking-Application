package com.netbanking.repository;

import com.netbanking.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUser_Id(Long userId);
    @Query("SELECT a FROM Account a JOIN FETCH a.user")
    List<Account> findAllWithUser();

    Page<Account> findAll(Pageable pageable);

    @Query("""
        SELECT a FROM Account a
        JOIN a.user u
        WHERE (:status IS NULL OR a.status = :status)
          AND (:accountType IS NULL OR a.accountType = :accountType)
          AND (
                :search IS NULL OR
                a.accountNumber LIKE %:search% OR
                u.username LIKE %:search%
              )
    """)
    Page<Account> searchAccounts(
            String status,
            String accountType,
            String search,
            Pageable pageable
    );


}
