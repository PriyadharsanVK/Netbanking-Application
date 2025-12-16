package com.netbanking.controller;

import com.netbanking.dto.LoginRequest;
import com.netbanking.dto.LoginResponse;
import com.netbanking.dto.RegisterRequest;
import com.netbanking.entity.User;
import com.netbanking.service.UserService;
import com.netbanking.util.PasswordUtil;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Component;
import com.netbanking.entity.Account;
import com.netbanking.repository.AccountRepository;
import java.util.List;


import java.util.Optional;

@Component
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

    private final UserService userService;
    private final AccountRepository accountRepository;


    public UserController(UserService userService, AccountRepository accountRepository) {
        this.userService = userService;
        this.accountRepository = accountRepository;
    }

    /* -------- REGISTER -------- */

    @POST
    @Path("/register")
    public Response register(RegisterRequest request) {

        if (request.getUsername() == null || request.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username and password required")
                    .build();
        }

        User user = userService.register(
                request.getUsername(),
                request.getPassword()   // hashing later
        );

        return Response.ok(user.getId()).build();
    }

    /* -------- LOGIN -------- */

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {

        // 1. Validate basic input
        if (request.getUsername() == null ||
                request.getPassword() == null ||
                request.getAccountNumber() == null) {

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username, password and account number are required")
                    .build();
        }

        // 2. Validate user credentials
        Optional<User> userOpt = userService.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid credentials")
                    .build();
        }

        User user = userOpt.get();

        if (!PasswordUtil.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid credentials")
                    .build();
        }

        // 3. Fetch all accounts of this user
        List<Account> userAccounts =
                accountRepository.findByUserId(user.getId());

        // 4. If user has NO accounts at all
        if (userAccounts.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("No account is linked with this user")
                    .build();
        }

        // 5. Validate account ownership
        boolean accountBelongsToUser = userAccounts.stream()
                .anyMatch(acc ->
                        acc.getAccountNumber()
                                .equals(request.getAccountNumber())
                );

        if (!accountBelongsToUser) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("This account does not belong to you")
                    .build();
        }

        // 6. Successful login
        Account loggedInAccount = userAccounts.stream()
                .filter(acc -> acc.getAccountNumber()
                        .equals(request.getAccountNumber()))
                .findFirst()
                .get();

        return Response.ok(
                new LoginResponse(
                        user.getId(),
                        loggedInAccount.getId(),
                        loggedInAccount.getAccountNumber()
                )
        ).build();

    }

}
