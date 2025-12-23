package com.netbanking.service;

import com.netbanking.dto.AdminAccountResponse;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAccountService {

    private final AccountRepository accountRepository;

    public AdminAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Page<AdminAccountResponse> getAccounts(
            String status,
            String accountType,
            String search,
            String sortBy,
            String sortDir,
            int page,
            int size
    ) {

        String finalSortBy = (sortBy == null || sortBy.isBlank())
                ? "createdAt"
                : sortBy;

        String finalSortDir = (sortDir == null || sortDir.isBlank())
                ? "desc"
                : sortDir;

        Sort sort = Sort.by(
                finalSortDir.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                finalSortBy
        );

        int finalPage = Math.max(page, 0);
        int finalSize = (size <= 0) ? 10 : size;

        PageRequest pageable = PageRequest.of(finalPage, finalSize, sort);

        Page<Account> accounts =
                accountRepository.searchAccounts(
                        status,
                        accountType,
                        search,
                        pageable
                );

        return accounts.map(acc ->
                new AdminAccountResponse(
                        acc.getId(),
                        acc.getAccountNumber(),
                        acc.getAccountType(),
                        acc.getBalance(),
                        acc.getStatus(),
                        acc.getCreatedAt()
                )
        );
    }

    @Transactional
    public void blockAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus("BLOCKED");
    }

    @Transactional
    public void unblockAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus("ACTIVE");
    }
}
