package com.netbanking.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable ex) {

        ex.printStackTrace(); // VERY IMPORTANT for debugging

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(ex.getMessage())
                .header("Access-Control-Allow-Origin", "http://localhost:5173")
                .build();
    }
}
