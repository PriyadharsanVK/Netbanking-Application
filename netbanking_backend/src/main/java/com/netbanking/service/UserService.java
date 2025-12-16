package com.netbanking.service;

import com.netbanking.entity.User;
import com.netbanking.repository.UserRepository;
import com.netbanking.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /* -------- REGISTER -------- */

    public User register(String username, String passwordHash) {

        // check if username already exists
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(
                PasswordUtil.hash(passwordHash)
        );

        return userRepository.save(user);
    }

    /* -------- LOGIN SUPPORT -------- */

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
