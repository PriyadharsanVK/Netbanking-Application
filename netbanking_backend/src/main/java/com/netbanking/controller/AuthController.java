package com.netbanking.controller;

import com.netbanking.dto.LoginRequest;
import com.netbanking.dto.LoginResponse;
import com.netbanking.service.AuthService;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Response.ok(response).build();
    }
}
