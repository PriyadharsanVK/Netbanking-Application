package com.netbanking.controller;

import com.netbanking.entity.Account;
import com.netbanking.entity.Loan;
import com.netbanking.entity.LoanEMI;
import com.netbanking.entity.Transaction;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.LoanEMIRepository;
import com.netbanking.repository.LoanRepository;

import com.netbanking.repository.TransactionRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Component
@Path("/loans")
@Produces(MediaType.APPLICATION_JSON)
public class LoanController {

    private final LoanRepository loanRepository;
    private final LoanEMIRepository loanEMIRepository;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public LoanController(
            LoanRepository loanRepository,
            LoanEMIRepository loanEMIRepository, TransactionRepository transactionRepository, AccountRepository accountRepository
    ) {
        this.loanRepository = loanRepository;
        this.loanEMIRepository = loanEMIRepository;
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    /* ---------- VIEW LOANS ---------- */
    @GET
    @Path("/account/{accountId}")
    public Response getLoans(@PathParam("accountId") Long accountId) {

        List<Loan> loans = loanRepository.findByAccount_Id(accountId);
        return Response.ok(loans).build();
    }

    /* ---------- VIEW EMI SCHEDULE ---------- */
    @GET
    @Path("/{loanId}/emis")
    public Response getLoanEMIs(@PathParam("loanId") Long loanId) {

        List<LoanEMI> emis =
                loanEMIRepository.findByLoan_IdOrderByEmiNumberAsc(loanId);

        return Response.ok(emis).build();
    }

    @POST
    @Path("/{loanId}/pay-emi")
    @Transactional
    public Response payEmi(@PathParam("loanId") Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));

        if (!"ACTIVE".equals(loan.getStatus())) {
            throw new WebApplicationException("Loan is not active",  Response.Status.BAD_REQUEST);
        }

        if (loan.getOutstandingAmount() <= 0) {
            throw new WebApplicationException("Loan already closed", Response.Status.BAD_REQUEST);
        }

        Account account = loan.getAccount();
        double emi = loan.getEmiAmount();

        if (account.getBalance().doubleValue() < emi) {
            throw new WebApplicationException("Insufficient balance for EMI payment", Response.Status.BAD_REQUEST);
        }

        // Deduct balance
        account.setBalance(
                account.getBalance().subtract(BigDecimal.valueOf(emi))
        );

        // Reduce outstanding
        loan.setOutstandingAmount(
                loan.getOutstandingAmount() - emi
        );

        // Close loan if fully paid
        if (loan.getOutstandingAmount() <= 0) {
            loan.setOutstandingAmount(0.0);
            loan.setStatus("CLOSED");
        }

        accountRepository.save(account);
        loanRepository.save(loan);

        // Create transaction
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setAmount(BigDecimal.valueOf(emi));
        tx.setType("DEBIT");
        tx.setDescription("EMI payment for " + loan.getLoanType() + " loan");
        tx.setCreatedAt(Instant.now());

        transactionRepository.save(tx);

        return Response.ok("EMI paid successfully").build();
    }

    @POST
    @Path("/{loanId}/foreclose")
    public Response forecloseLoan(@PathParam("loanId") Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found"));

        if (!"ACTIVE".equals(loan.getStatus())) {
            throw new WebApplicationException("Loan is not active");
        }

        if (loan.getOutstandingAmount() <= 0) {
            throw new WebApplicationException("Loan already closed");
        }

        // FULL PAYMENT
        loan.setOutstandingAmount(0.0);
        loan.setStatus("CLOSED");

        loanRepository.save(loan);

        return Response.ok("Loan foreclosed successfully").build();
    }

}
