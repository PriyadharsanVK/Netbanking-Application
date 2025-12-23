package com.netbanking.controller;

import com.netbanking.service.AdminAccountRequestService;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.springframework.stereotype.Component;

@Component
@Path("/admin/account-requests")
@Produces(MediaType.APPLICATION_JSON)
public class AdminAccountRequestController {

    private final AdminAccountRequestService service;

    public AdminAccountRequestController(AdminAccountRequestService service) {
        this.service = service;
    }

//    @GET
//    public Response getPendingRequests() {
//        return Response.ok(service.getPendingRequests()).build();
//    }

    @POST
    @Path("/{id}/approve")
    public Response approve(@PathParam("id") Long id) {
        service.approveRequest(id);
        return Response.ok("Account request approved successfully").build();
    }

    @POST
    @Path("/{id}/reject")
    public Response reject(@PathParam("id") Long id) {
        service.rejectRequest(id);
        return Response.ok("Account request rejected successfully").build();
    }
    @GET
    public Response getRequests(
            @QueryParam("status") @DefaultValue("PENDING") String status,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return Response.ok(
                service.getRequests(status, page, size)
        ).build();
    }

}
