package com.netbanking.controller;

import com.netbanking.dto.TransferRequest;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;
import com.netbanking.service.TransactionService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

@Component
@Path("/transfer")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TransferController {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    public TransferController(AccountRepository accountRepository,
                              TransactionService transactionService) {
        this.accountRepository = accountRepository;
        this.transactionService = transactionService;
    }

    @POST
    public Response transfer(TransferRequest request) {

        if (request.getFromAccountId() == null ||
                request.getToAccountId() == null ||
                request.getAmount() == null) {

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Missing required fields")
                    .build();
        }

        Account from = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new NotFoundException("Source account not found"));

        Account to = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new NotFoundException("Destination account not found"));

        transactionService.transfer(from, to, request.getAmount());

        return Response.ok("Transfer successful").build();
    }
}
