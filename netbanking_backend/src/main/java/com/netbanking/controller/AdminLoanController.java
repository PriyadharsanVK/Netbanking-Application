package com.netbanking.controller;

import com.netbanking.entity.Account;
import com.netbanking.entity.Loan;
import com.netbanking.entity.LoanRequest;
import com.netbanking.repository.LoanRepository;
import com.netbanking.repository.LoanRequestRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
@Path("/admin/loan-requests")
@Produces(MediaType.APPLICATION_JSON)
public class AdminLoanController {

    private final LoanRequestRepository loanRequestRepository;
    private final LoanRepository loanRepository;

    public AdminLoanController(
            LoanRequestRepository loanRequestRepository,
            LoanRepository loanRepository
    ) {
        this.loanRequestRepository = loanRequestRepository;
        this.loanRepository = loanRepository;
    }

    /* ---------- VIEW ALL LOAN REQUESTS ---------- */
    @GET
    public Response getAllLoanRequests() {
        List<LoanRequest> requests = loanRequestRepository.findAll();
        return Response.ok(requests).build();
    }

    private double calculateEmi(
            double principal,
            double annualInterestRate,
            int tenureMonths
    ) {
        double monthlyRate = annualInterestRate / 12 / 100;
        double numerator = principal * monthlyRate *
                Math.pow(1 + monthlyRate, tenureMonths);
        double denominator =
                Math.pow(1 + monthlyRate, tenureMonths) - 1;

        return Math.round((numerator / denominator) * 100.0) / 100.0;
    }


    /* ---------- APPROVE LOAN ---------- */
    @POST
    @Path("/{requestId}/approve")
    public Response approveLoan(@PathParam("requestId") Long requestId) {

        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Loan request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Loan request already processed");
        }

        Account account = request.getAccount();

        boolean activeLoanExists =
                loanRepository.existsByAccount_IdAndLoanTypeAndStatus(
                        account.getId(),
                        request.getLoanType(),
                        "ACTIVE"
                );

        if (activeLoanExists) {
            throw new BadRequestException(
                    "Active " + request.getLoanType() + " loan already exists"
            );
        }

        double principal = request.getPrincipalAmount();
        double interestRate = request.getInterestRate();
        int tenure = request.getTenureMonths();

        double emi = calculateEmi(principal, interestRate, tenure);

        Loan loan = new Loan();
        loan.setAccount(account);
        loan.setLoanType(request.getLoanType());
        loan.setPrincipalAmount(principal);
        loan.setOutstandingAmount(principal); // FULL amount pending initially
        loan.setInterestRate(interestRate);
        loan.setTenureMonths(tenure);
        loan.setEmiAmount(emi);
        loan.setStatus("ACTIVE");
        loan.setStartDate(LocalDate.now());

        loanRepository.save(loan);


        /* UPDATE REQUEST */
        request.setStatus("APPROVED");
        loanRequestRepository.save(request);

        return Response.ok("Loan approved and activated").build();
    }

    /* ---------- REJECT LOAN ---------- */
    @POST
    @Path("/{requestId}/reject")
    public Response rejectLoan(@PathParam("requestId") Long requestId) {

        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Loan request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Loan request already processed");
        }

        request.setStatus("REJECTED");
        loanRequestRepository.save(request);

        return Response.ok("Loan request rejected").build();
    }
}
