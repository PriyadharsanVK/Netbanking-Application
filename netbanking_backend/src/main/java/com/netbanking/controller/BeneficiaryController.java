package com.netbanking.controller;

import com.netbanking.dto.BeneficiaryResponse;
import com.netbanking.dto.TransferRequest;
import com.netbanking.entity.Account;
import com.netbanking.entity.Beneficiary;
import com.netbanking.entity.User;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.BeneficiaryRepository;
import com.netbanking.repository.UserRepository;
import com.netbanking.service.TransactionService;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/beneficiaries")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BeneficiaryController {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    public BeneficiaryController(
            BeneficiaryRepository beneficiaryRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionService transactionService
    ) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionService = transactionService;
    }

    /* ---------- ADD BENEFICIARY ---------- */
    @POST
    public Response addBeneficiary(Beneficiary request) {

        // 1️⃣ Validate user
        User user = userRepository.findById(request.getUser().getId())
                .orElseThrow(() -> new WebApplicationException(
                        Response.status(Response.Status.NOT_FOUND)
                                .entity("User not found")
                                .type(MediaType.TEXT_PLAIN)
                                .build()
                ));

        // 2️⃣ Check account exists
        Account account = accountRepository
                .findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new WebApplicationException(
                        Response.status(Response.Status.BAD_REQUEST)
                                .entity("Account does not exist")
                                .type(MediaType.TEXT_PLAIN)
                                .build()
                ));

        // 3️⃣ Prevent duplicate beneficiary
        if (beneficiaryRepository.existsByUserIdAndAccountNumber(
                user.getId(), request.getAccountNumber())) {

            throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                            .entity("Beneficiary already exists")
                            .type(MediaType.TEXT_PLAIN)
                            .build()
            );
        }

        // 4️⃣ Save beneficiary
        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setUser(user);
        beneficiary.setName(request.getName());
        beneficiary.setAccountNumber(request.getAccountNumber());
        beneficiary.setActive(true);

        beneficiaryRepository.save(beneficiary);

        return Response.ok("Beneficiary added successfully").build();
    }


    /* ---------- VIEW ALL BENEFICIARIES OF USER ---------- */
    @GET
    @Path("/user/{userId}")
    public Response getUserBeneficiaries(@PathParam("userId") Long userId) {

        List<Account> userAccounts = accountRepository.findByUser_Id(userId);

        List<String> userAccountNumbers = userAccounts.stream()
                .map(Account::getAccountNumber)
                .toList();

        List<Beneficiary> beneficiaries =
                beneficiaryRepository.findByUserIdAndActiveTrue(userId);

        List<BeneficiaryResponse> response = beneficiaries.stream()
                .filter(b -> !userAccountNumbers.contains(b.getAccountNumber()))
                .map(b -> new BeneficiaryResponse(
                        b.getId(),
                        b.getName(),
                        b.getAccountNumber(),
                        b.getCreatedAt()
                ))
                .toList();

        return Response.ok(response).build();
    }

    /* ---------- DELETE BENEFICIARY (SOFT DELETE) ---------- */
    @DELETE
    @Path("/{beneficiaryId}")
    public Response deleteBeneficiary(@PathParam("beneficiaryId") Long beneficiaryId) {

        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() ->
                        new NotFoundException("Beneficiary not found")
                );

        beneficiary.setActive(false);
        beneficiaryRepository.save(beneficiary);

        return Response.ok("Beneficiary deleted successfully").build();
    }

    /* ---------- TRANSFER TO BENEFICIARY ---------- */
    @POST
    @Path("/{beneficiaryId}/transfer")
    public Response transferToBeneficiary(
            @PathParam("beneficiaryId") Long beneficiaryId,
            TransferRequest request
    ) {

        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() ->
                        new NotFoundException("Beneficiary not found")
                );

        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() ->
                        new NotFoundException("Source account not found")
                );

        // 🔐 SECURITY CHECK
        if (!fromAccount.getUser().getId().equals(beneficiary.getUser().getId())) {
            throw new ForbiddenException("Unauthorized transfer attempt");
        }

        Account toAccount = accountRepository
                .findByAccountNumber(beneficiary.getAccountNumber())
                .orElseThrow(() ->
                        new NotFoundException("Destination account not found")
                );

        transactionService.transfer(
                fromAccount,
                toAccount,
                request.getAmount()
        );

        return Response.ok("Transfer successful").build();
    }
}
