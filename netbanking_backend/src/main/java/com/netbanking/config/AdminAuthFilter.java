package com.netbanking.config;

import jakarta.annotation.Priority;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import jakarta.ws.rs.Priorities;

@Provider
@Priority(Priorities.AUTHORIZATION)
public class AdminAuthFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) {

        String path = requestContext.getUriInfo().getPath();

        // Apply only to admin APIs
        if (!path.startsWith("api/admin")) {
            return;
        }

        // TEMPORARY: role should come from session / token
        // For now, assume role is passed as header
        String role = requestContext.getHeaderString("ROLE");

        if (role == null || !role.equals("ADMIN")) {
            throw new ForbiddenException("Admin access only");
        }
    }
}
