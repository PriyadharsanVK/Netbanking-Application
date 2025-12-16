package com.netbanking.service;

import com.netbanking.entity.Account;
import com.netbanking.entity.Admin;
import com.netbanking.entity.User;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.AdminRepository;
import com.netbanking.repository.UserRepository;
import com.netbanking.util.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public AdminService(AdminRepository adminRepository,
                        UserRepository userRepository,
                        AccountRepository accountRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    /* -------- ADMIN LOGIN -------- */

    public Admin login(String username, String password) {

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        Admin admin = adminOpt.get();

        // simple password check (for now)
        if (!PasswordUtil.matches(password, admin.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        return admin;
    }

    /* -------- CREATE ACCOUNT -------- */

    @Transactional
    public Account createAccount(Long userId,
                                 String accountNumber,
                                 String accountType,
                                 BigDecimal initialBalance) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setAccountType(accountType);
        account.setBalance(initialBalance == null ? BigDecimal.ZERO : initialBalance);
        account.setUser(user);

        return accountRepository.save(account);
    }
}
