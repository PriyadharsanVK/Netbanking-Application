package com.netbanking.controller;

import com.netbanking.entity.Loan;
import com.netbanking.repository.LoanRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/admin/loans")
@Produces(MediaType.APPLICATION_JSON)
public class AdminLoanManagementController {

    private final LoanRepository loanRepository;

    public AdminLoanManagementController(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    /* ---------- VIEW ALL LOANS ---------- */
    @GET
    public Response getAllLoans() {
        List<Loan> loans = loanRepository.findAll();
        return Response.ok(loans).build();
    }
}
