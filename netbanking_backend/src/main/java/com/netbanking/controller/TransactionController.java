package com.netbanking.controller;

import com.netbanking.dto.TransactionResponse;
import com.netbanking.entity.Transaction;
import com.netbanking.repository.TransactionRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.util.ArrayList;

@Component
@Path("/transactions")
@Produces(MediaType.APPLICATION_JSON)
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /* -------- TRANSACTION HISTORY -------- */

    @GET
    @Path("/account/{accountId}")
    @Transactional(readOnly = true)
    public Response getTransactions(@PathParam("accountId") Long accountId) {

        List<Transaction> transactions =
                transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);

        if (transactions.isEmpty()) {
            return Response.ok(List.of()).build();
        }

        BigDecimal runningBalance = transactions.get(0)
                .getAccount()
                .getBalance();   // current balance

        List<TransactionResponse> response = new ArrayList<>();

        for (Transaction tx : transactions) {

            response.add(new TransactionResponse(
                    tx.getType(),
                    tx.getAmount(),
                    tx.getDescription(),
                    tx.getCreatedAt(),
                    tx.getAccount().getAccountNumber(),
                    runningBalance,
                    null   // ✅ transferType not applicable here
            ));

            // reverse-calculate balance for previous transaction
            if ("CREDIT".equals(tx.getType())) {
                runningBalance = runningBalance.subtract(tx.getAmount());
            } else {
                runningBalance = runningBalance.add(tx.getAmount());
            }
        }

        return Response.ok(response).build();
    }
}
