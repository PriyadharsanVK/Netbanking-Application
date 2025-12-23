package com.netbanking.controller;

import com.netbanking.dto.LoginRequest;
import com.netbanking.dto.LoginResponse;
import com.netbanking.dto.RegisterRequest;
import com.netbanking.entity.User;
import com.netbanking.repository.UserRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

import static com.netbanking.enums.UserRole.USER;

@Component
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* -------- REGISTER -------- */

    @POST
    @Path("/register")
    public Response register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        User user = new User();
        user.setRole(USER);
        user.setUsername(request.getUsername());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return Response.ok("User registered successfully").build();
    }

    /* -------- LOGIN -------- */

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {

        if (request.getUsername() == null || request.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username and password are required")
                    .build();
        }

        Optional<User> userOpt =
                userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid credentials")
                    .build();
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid credentials")
                    .build();
        }

        // ✅ Login successful
        return Response.ok(
                Map.of(
                        "userId", user.getId(),
                        "role", user.getRole()
                )
        ).build();

    }
}
