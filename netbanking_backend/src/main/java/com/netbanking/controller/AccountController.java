package com.netbanking.controller;

import com.netbanking.dto.AccountResponse;
import com.netbanking.dto.DepositRequest;
import com.netbanking.dto.TransferRequest;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;
import com.netbanking.service.TransactionService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/accounts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AccountController {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    public AccountController(AccountRepository accountRepository,
                             TransactionService transactionService) {
        this.accountRepository = accountRepository;
        this.transactionService = transactionService;
    }

    /* -------- VIEW ACCOUNTS -------- */

    @GET
    @Path("/user/{userId}")
    public Response getAccounts(
            @PathParam("userId") Long userId,
            @QueryParam("exclude") Long excludeAccountId
    ) {
        List<Account> accounts = accountRepository.findByUser_Id(userId);

        if (excludeAccountId != null) {
            accounts = accounts.stream()
                    .filter(acc -> !acc.getId().equals(excludeAccountId))
                    .toList();
        }

        List<AccountResponse> response = accounts.stream()
                .map(acc -> new AccountResponse(
                        acc.getId(),
                        acc.getAccountNumber(),
                        acc.getAccountType(),
                        acc.getBalance(),
                        acc.getStatus(),
                        acc.getCreatedAt()
                ))
                .toList();

        return Response.ok(response).build();
    }

    /* -------- DEPOSIT -------- */

    @POST
    @Path("/deposit")
    public Response deposit(DepositRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        transactionService.deposit(account, request.getAmount());

        return Response.ok("Deposit successful").build();
    }

    /* -------- SELF TRANSFER / NORMAL TRANSFER -------- */

    @POST
    @Path("/transfer")
    public Response transfer(TransferRequest request) {

        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new BadRequestException("Cannot transfer to same account");
        }

        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new NotFoundException("Source account not found"));

        Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new NotFoundException("Destination account not found"));

        transactionService.transfer(fromAccount, toAccount, request.getAmount());

        return Response.ok("Transfer successful").build();
    }

    @GET
    @Path("/number/{accountNumber}")
    public Response getAccountByNumber(@PathParam("accountNumber") String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        AccountResponse response = new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getStatus(),
                account.getCreatedAt()
        );

        return Response.ok(response).build();
    }
    @GET
    @Path("/admin/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAccounts() {

        List<Account> accounts = accountRepository.findAll();

        List<AccountResponse> response = accounts.stream()
                .map(acc -> new AccountResponse(
                        acc.getId(),
                        acc.getAccountNumber(),
                        acc.getAccountType(),
                        acc.getBalance(),
                        acc.getStatus(),
                        acc.getCreatedAt()
                ))
                .toList();

        return Response.ok(response).build();
    }


}
