package com.netbanking.service;

import com.netbanking.dto.LoginRequest;
import com.netbanking.dto.LoginResponse;
import com.netbanking.entity.User;
import com.netbanking.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {

        // 1. Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new NotAuthorizedException("Invalid credentials"));

        // 2. Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new NotAuthorizedException("Invalid credentials");
        }

        // 3. Validate role (USER / ADMIN)
        if (!user.getRole().name().equals(request.getLoginAs())) {
            throw new ForbiddenException("Access denied for this role");
        }

        // 4. Return login response (session / JWT comes later)
        return new LoginResponse(user.getId(), user.getRole().name());
    }
}
