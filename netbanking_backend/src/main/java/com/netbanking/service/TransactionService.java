package com.netbanking.service;

import com.netbanking.entity.Account;
import com.netbanking.entity.Transaction;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.TransactionRepository;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(AccountRepository accountRepository,
                              TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    /* -------- DEPOSIT -------- */

    @Transactional
    public void deposit(Account account, BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        // update balance
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        // record transaction
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setType("CREDIT");
        tx.setAmount(amount);
        tx.setDescription("Deposit");

        transactionRepository.save(tx);
    }

    /* -------- SELF / NORMAL TRANSFER -------- */

    @Transactional
    public void transfer(Account from, Account to, BigDecimal amount) {

        if (from.getId().equals(to.getId())) {
            throw new IllegalArgumentException("Source and destination accounts cannot be same");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        if (from.getBalance().compareTo(amount) < 0) {
            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity("Insufficient balance. Please check your available funds.")
                            .build()
            );
        }


        // debit source
        from.setBalance(from.getBalance().subtract(amount));
        accountRepository.save(from);

        Transaction debit = new Transaction();
        debit.setAccount(from);
        debit.setType("DEBIT");
        debit.setAmount(amount);
        debit.setDescription("Transfer to account " + to.getAccountNumber());
        transactionRepository.save(debit);

        // credit destination
        to.setBalance(to.getBalance().add(amount));
        accountRepository.save(to);

        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType("CREDIT");
        credit.setAmount(amount);
        credit.setDescription("Transfer from account " + from.getAccountNumber());
        transactionRepository.save(credit);
    }
}
