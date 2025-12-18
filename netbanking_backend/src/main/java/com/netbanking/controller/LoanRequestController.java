package com.netbanking.controller;

import com.netbanking.dto.CreateLoanRequest;
import com.netbanking.entity.Account;
import com.netbanking.entity.LoanRequest;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.LoanRepository;
import com.netbanking.repository.LoanRequestRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Path("/loan-requests")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoanRequestController {

    private final LoanRequestRepository loanRequestRepository;
    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;

    public LoanRequestController(
            LoanRequestRepository loanRequestRepository,
            LoanRepository loanRepository,
            AccountRepository accountRepository
    ) {
        this.loanRequestRepository = loanRequestRepository;
        this.loanRepository = loanRepository;
        this.accountRepository = accountRepository;
    }

    /* ================= REQUEST LOAN ================= */

    @POST
    public Response requestLoan(CreateLoanRequest request) {

        String loanType = request.getLoanType().toUpperCase();

        /* -------- BASIC VALIDATION -------- */
        if (request.getPrincipalAmount() == null ||
                request.getPrincipalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Invalid principal amount");
        }

        double interestRate;
        int tenureMonths;

        switch (loanType) {
            case "HOME" -> {
                interestRate = 8.5;
                tenureMonths = 240;
            }
            case "CAR" -> {
                interestRate = 9.5;
                tenureMonths = 60;
            }
            case "PERSONAL" -> {
                interestRate = 12.0;
                tenureMonths = 36;
            }
            default -> throw new BadRequestException("Invalid loan type");
        }

        if (request.getLoanType() == null) {
            throw new WebApplicationException("Loan type is required", Response.Status.BAD_REQUEST);
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        /* ACTIVE LOAN CHECK */
        if (loanRepository.existsByAccount_IdAndLoanTypeAndStatus(
                account.getId(), loanType, "ACTIVE")) {

            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("Active " + loanType + " loan already exists")
                    .build();
        }

        /* PENDING REQUEST CHECK */
        if (loanRequestRepository.existsByAccount_IdAndLoanTypeAndStatus(
                account.getId(), loanType, "PENDING")) {

            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("Loan request of same type already exists")
                    .build();
        }

        /* -------- CREATE REQUEST -------- */
        LoanRequest loanRequest = new LoanRequest();
        loanRequest.setAccount(account);
        loanRequest.setLoanType(loanType);
        loanRequest.setPrincipalAmount(request.getPrincipalAmount().doubleValue());
        loanRequest.setTenureMonths(tenureMonths);
        loanRequest.setInterestRate(interestRate);
        loanRequest.setStatus("PENDING");


        loanRequestRepository.save(loanRequest);

        return Response.ok("Loan request submitted").build();
    }

    /* ================= VIEW ACCOUNT LOAN REQUESTS ================= */

    @GET
    @Path("/account/{accountId}")
    public Response getAccountLoanRequests(
            @PathParam("accountId") Long accountId) {

        return Response.ok(
                loanRequestRepository.findByAccount_Id(accountId)
        ).build();
    }
}
