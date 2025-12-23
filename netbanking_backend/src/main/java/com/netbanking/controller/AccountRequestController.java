package com.netbanking.controller;

import com.netbanking.dto.AccountRequestCreateRequest;
import com.netbanking.dto.AccountRequestUserResponse;
import com.netbanking.entity.AccountRequest;
import com.netbanking.entity.User;
import com.netbanking.repository.AccountRequestRepository;
import com.netbanking.repository.UserRepository;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Path("/account-requests")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AccountRequestController {

    private final UserRepository userRepository;
    private final AccountRequestRepository accountRequestRepository;

    public AccountRequestController(UserRepository userRepository,
                                    AccountRequestRepository accountRequestRepository) {
        this.userRepository = userRepository;
        this.accountRequestRepository = accountRequestRepository;
    }

    @POST
    public Response createRequest(AccountRequestCreateRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        AccountRequest ar = new AccountRequest();
        ar.setUser(user);
        ar.setFullName(request.getFullName());
        ar.setPhone(request.getPhone());
        ar.setAddress(request.getAddress());
        ar.setAccountType(request.getAccountType());
        ar.setStatus("PENDING");

        accountRequestRepository.save(ar);

        return Response.status(Response.Status.CREATED)
                .entity("Account request submitted")
                .build();
    }

    @GET
    @Path("/user/{userId}")
    public Response getUserRequests(@PathParam("userId") Long userId) {

        List<AccountRequest> requests =
                accountRequestRepository.findByUserId(userId);

        List<AccountRequestUserResponse> response = requests.stream()
                .map(r -> new AccountRequestUserResponse(
                        r.getId(),
                        r.getAccountType(),
                        r.getStatus(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return Response.ok(response).build();
    }
}
