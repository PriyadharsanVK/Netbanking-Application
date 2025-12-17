package com.netbanking.controller;

import com.netbanking.dto.AccountRequestResponse;
import com.netbanking.entity.Account;
import com.netbanking.entity.AccountRequest;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.AccountRequestRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Path("/admin/account-requests")
@Produces(MediaType.APPLICATION_JSON)
public class AdminAccountRequestController {

    private final AccountRequestRepository accountRequestRepository;
    private final AccountRepository accountRepository; // ✅ MISSING FIELD FIXED

    public AdminAccountRequestController(AccountRequestRepository accountRequestRepository,
                                         AccountRepository accountRepository) {
        this.accountRequestRepository = accountRequestRepository;
        this.accountRepository = accountRepository; // ✅ INJECTED
    }

    /* ---------- VIEW ALL REQUESTS ---------- */
    @GET
    public Response getAllRequests() {

        List<AccountRequest> requests = accountRequestRepository.findAll();

        List<AccountRequestResponse> response = requests.stream()
                .map(r -> new AccountRequestResponse(
                        r.getId(),
                        r.getUser().getUsername(),
                        r.getFullName(),
                        r.getPhone(),
                        r.getAccountType(),
                        r.getStatus(),
                        r.getCreatedAt()
                ))
                .toList();

        return Response.ok(response).build();
    }

    /* ---------- APPROVE ---------- */
    @POST
    @Path("/{id}/approve")
    public Response approve(@PathParam("id") Long requestId) {

        AccountRequest req = accountRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Request not found"));

        if (!"PENDING".equals(req.getStatus())) {
            throw new BadRequestException("Request already processed");
        }

        Account account = new Account();
        account.setUser(req.getUser());
        account.setAccountType(req.getAccountType());
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(BigDecimal.ZERO);
        account.setStatus("ACTIVE");

        accountRepository.save(account); // ✅ NOW WORKS

        req.setStatus("APPROVED");
        accountRequestRepository.save(req);

        return Response.ok("Account created successfully").build();
    }

    /* ---------- REJECT ---------- */
    @POST
    @Path("/{id}/reject")
    public Response reject(@PathParam("id") Long requestId) {

        AccountRequest req = accountRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Request not found"));

        if (!"PENDING".equals(req.getStatus())) {
            throw new BadRequestException("Request already processed");
        }

        req.setStatus("REJECTED");
        accountRequestRepository.save(req);

        return Response.ok("Request rejected").build();
    }

    private String generateAccountNumber() {
        return "AC" + System.currentTimeMillis();
    }
}
