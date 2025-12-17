package com.netbanking.repository;

import com.netbanking.entity.AccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRequestRepository
        extends JpaRepository<AccountRequest, Long> {

    List<AccountRequest> findByUserId(Long userId);
    List<AccountRequest> findByStatus(String status);
}
