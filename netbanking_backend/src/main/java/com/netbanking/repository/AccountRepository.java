package com.netbanking.repository;

import com.netbanking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUser_Id(Long userId);
    @Query("SELECT a FROM Account a JOIN FETCH a.user")
    List<Account> findAllWithUser();

}
