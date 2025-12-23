package com.netbanking.controller;

import com.netbanking.dto.AdminAccountResponse;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;

import com.netbanking.service.AdminAccountService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Path("/admin/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AdminAccountController {

    private final AccountRepository accountRepository;
    private final AdminAccountService adminAccountService;

    public AdminAccountController(AccountRepository accountRepository, AdminAccountService adminAccountService) {
        this.accountRepository = accountRepository;
        this.adminAccountService = adminAccountService;
    }

    @GET
    public Response getAccounts(
            @QueryParam("status") String status,
            @QueryParam("accountType") String accountType,
            @QueryParam("search") String search,
            @QueryParam("sortBy") @DefaultValue("createdAt") String sortBy,
            @QueryParam("sortDir") @DefaultValue("desc") String sortDir,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return Response.ok(
                adminAccountService.getAccounts(
                        status,
                        accountType,
                        search,
                        sortBy,
                        sortDir,
                        page,
                        size
                )
        ).build();
    }

    @POST
    @Path("/{id}/block")
    public Response block(@PathParam("id") Long id) {
        adminAccountService.blockAccount(id);
        return Response.ok("Account blocked").build();
    }

    @POST
    @Path("/{id}/unblock")
    public Response unblock(@PathParam("id") Long id) {
        adminAccountService.unblockAccount(id);
        return Response.ok("Account unblocked").build();
    }

}
