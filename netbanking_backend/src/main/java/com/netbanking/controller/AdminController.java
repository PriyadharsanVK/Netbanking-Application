package com.netbanking.controller;

import com.netbanking.dto.AdminLoginRequest;
import com.netbanking.dto.CreateAccountRequest;
import com.netbanking.entity.Account;
import com.netbanking.entity.Admin;
import com.netbanking.service.AdminService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;

@Component
@Path("/admin")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /* -------- ADMIN LOGIN -------- */

    @POST
    @Path("/login")
    public Response login(AdminLoginRequest request) {

        if (request.getUsername() == null || request.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username and password required")
                    .build();
        }

        Admin admin = adminService.login(
                request.getUsername(),
                request.getPassword()
        );

        return Response.ok("Admin login successful").build();
    }

    /* -------- CREATE ACCOUNT -------- */

    @POST
    @Path("/create-account")
    public Response createAccount(CreateAccountRequest request) {

        if (request.getUserId() == null ||
                request.getAccountNumber() == null ||
                request.getAccountType() == null) {

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Missing required fields")
                    .build();
        }

        Account account = adminService.createAccount(
                request.getUserId(),
                request.getAccountNumber(),
                request.getAccountType(),
                request.getInitialBalance()
        );

        return Response.ok(account.getId()).build();
    }
}
