package com.netbanking.service;

import com.netbanking.dto.AdminAccountRequestResponse;
import com.netbanking.entity.Account;
import com.netbanking.entity.AccountRequest;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.AccountRequestRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminAccountRequestService {

    private final AccountRequestRepository requestRepository;
    private final AccountRepository accountRepository;

    public AdminAccountRequestService(AccountRequestRepository requestRepository,
                                      AccountRepository accountRepository) {
        this.requestRepository = requestRepository;
        this.accountRepository = accountRepository;
    }

    public List<AdminAccountRequestResponse> getPendingRequests() {

        return requestRepository.findByStatus("PENDING", PageRequest.of(0, 10))
                .stream()
                .map(req -> new AdminAccountRequestResponse(
                        req.getId(),
                        req.getUser().getUsername(),
                        req.getFullName(),
                        req.getPhone(),
                        req.getAddress(),
                        req.getAccountType(),
                        req.getStatus(),
                        req.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveRequest(Long requestId) {

        AccountRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Account request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException("Request already processed");
        }

        // Update request status
        request.setStatus("APPROVED");
        requestRepository.save(request);

        // Create account
        Account account = new Account();
        account.setUser(request.getUser());
        account.setAccountType(request.getAccountType());
        account.setBalance(BigDecimal.ZERO);
        account.setStatus("ACTIVE");
        account.setAccountNumber(generateAccountNumber());
    }

    @Transactional
    public void rejectRequest(Long requestId) {

        AccountRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Account request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException("Request already processed");
        }

        request.setStatus("REJECTED");
        requestRepository.save(request);
    }

    private String generateAccountNumber() {
        return "AC" + System.currentTimeMillis();
    }
    public Page<AdminAccountRequestResponse> getRequests(
            String status,
            int page,
            int size
    ) {
        Page<AccountRequest> requests =
                requestRepository.findByStatus(
                        status,
                        PageRequest.of(page, size)
                );

        return requests.map(req ->
                new AdminAccountRequestResponse(
                        req.getId(),
                        req.getUser().getUsername(),
                        req.getFullName(),
                        req.getPhone(),
                        req.getAddress(),
                        req.getAccountType(),
                        req.getStatus(),
                        req.getCreatedAt()
                )
        );
    }

}
