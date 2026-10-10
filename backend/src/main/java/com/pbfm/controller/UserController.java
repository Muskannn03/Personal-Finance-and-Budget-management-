package com.pbfm.controller;

import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import com.pbfm.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing users")
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody User request) {
        log.info("Creating a new user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        String rawPassword = request.getPasswordHash() != null && !request.getPasswordHash().trim().isEmpty()
                ? request.getPasswordHash()
                : request.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        request.setPasswordHash(passwordEncoder.encode(rawPassword));
        if (request.getRole() == null || request.getRole().trim().isEmpty()) {
            request.setRole("USER");
        }
        if (request.getCurrencyPreference() == null || request.getCurrencyPreference().trim().isEmpty()) {
            request.setCurrencyPreference("INR");
        }
        User savedUser = userRepository.save(request);
        
        log.info("User created successfully with ID: {}", savedUser.getUserId());
        return new ResponseEntity<>(
                ApiResponse.success(UserResponse.fromEntity(savedUser), "User created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return ResponseEntity.ok(ApiResponse.success(UserResponse.fromEntity(user)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody User request) {
        log.info("Updating user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if email is updated and already taken by someone else
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setCurrencyPreference(request.getCurrencyPreference());
        user.setRole(request.getRole());
        
        User updatedUser = userRepository.save(user);

        log.info("User with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(UserResponse.fromEntity(updatedUser), "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        log.info("Deleting user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user); // Triggers soft delete update SQL
        log.info("User with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        log.info("Fetching page {} of all users", pageable.getPageNumber());
        Page<User> usersPage = userRepository.findAll(pageable);
        Page<UserResponse> responsePage = usersPage.map(UserResponse::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(responsePage));
    }
}
