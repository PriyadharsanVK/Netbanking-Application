package com.netbanking.controller;

import com.netbanking.dto.AdminAccountResponse;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/admin/accounts")
//@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AdminAccountController {

    private final AccountRepository accountRepository;

    public AdminAccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GET
    public Response getAllAccounts() {

        List<Account> accounts = accountRepository.findAllWithUser();

        List<AdminAccountResponse> response = accounts.stream()
                .map(acc -> new AdminAccountResponse(
                        acc.getId(),
                        acc.getAccountNumber(),
                        acc.getAccountType(),
                        acc.getBalance(),
                        acc.getStatus(),
                        acc.getUser().getId(),
                        acc.getUser().getUsername()
                ))
                .toList();

        return Response.ok(response).build();
    }
}
