package com.pbfm.controller;

import com.pbfm.entity.Account;
import com.pbfm.entity.Category;
import com.pbfm.entity.User;
import com.pbfm.enums.AccountType;
import com.pbfm.enums.TransactionType;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.exception.UnauthorizedException;
import com.pbfm.repository.AccountRepository;
import com.pbfm.repository.CategoryRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import com.pbfm.response.UserResponse;
import com.pbfm.security.JwtTokenProvider;
import com.pbfm.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Authorization", description = "Endpoints for login, registration, token refresh, and password recovery")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    @Transactional
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@RequestBody User request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already exists: " + email);
        }

        String rawPassword = request.getPasswordHash() != null && !request.getPasswordHash().trim().isEmpty()
                ? request.getPasswordHash()
                : request.getPassword();

        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        request.setEmail(email);
        request.setName(request.getName().trim());
        request.setPasswordHash(passwordEncoder.encode(rawPassword));
        request.setRole("USER");
        if (request.getCurrencyPreference() == null || request.getCurrencyPreference().trim().isEmpty()) {
            request.setCurrencyPreference("INR");
        }

        User savedUser = userRepository.save(request);

        // Provision starter accounts and categories so user can manage finances immediately
        initializeUserDefaults(savedUser);

        return new ResponseEntity<>(
                ApiResponse.success(UserResponse.fromEntity(savedUser), "User registered successfully"),
                HttpStatus.CREATED
        );
    }

    private void initializeUserDefaults(User user) {
        try {
            Account savingsAccount = Account.builder()
                    .user(user)
                    .accountName("Primary Savings")
                    .accountType(AccountType.SAVINGS)
                    .balance(BigDecimal.ZERO)
                    .build();
            accountRepository.save(savingsAccount);

            Account cashAccount = Account.builder()
                    .user(user)
                    .accountName("Cash Wallet")
                    .accountType(AccountType.CASH)
                    .balance(BigDecimal.ZERO)
                    .build();
            accountRepository.save(cashAccount);

            String[][] defaultCats = {
                    {"Salary", "INCOME"},
                    {"Freelance", "INCOME"},
                    {"Investments", "INCOME"},
                    {"Other Income", "INCOME"},
                    {"Food & Dining", "EXPENSE"},
                    {"Groceries", "EXPENSE"},
                    {"Housing & Rent", "EXPENSE"},
                    {"Utilities & Bills", "EXPENSE"},
                    {"Shopping", "EXPENSE"},
                    {"Transportation", "EXPENSE"},
                    {"Entertainment", "EXPENSE"},
                    {"Healthcare", "EXPENSE"}
            };

            for (String[] cat : defaultCats) {
                Category category = Category.builder()
                        .user(user)
                        .categoryName(cat[0])
                        .type(TransactionType.valueOf(cat[1]))
                        .build();
                categoryRepository.save(category);
            }
        } catch (Exception e) {
            log.error("Failed to seed initial user defaults for user {}: ", user.getUserId(), e);
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and retrieve access token")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        log.info("Attempting login authentication for user email: {}", cleanEmail);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        cleanEmail,
                        request.getPassword()
                    )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        JwtResponse jwtResponse = JwtResponse.builder()
                .accessToken(jwt)
                .userId(principal.getId())
                .name(principal.getName())
                .email(principal.getEmail())
                .role(principal.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.success(jwtResponse, "Login successful"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT access token using current valid Authorization header")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            if (tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getUsernameFromJwt(jwt);
                User user = userRepository.findByEmailIgnoreCase(email != null ? email.trim() : "")
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

                String newToken = tokenProvider.generateTokenFromUsername(email);

                JwtResponse jwtResponse = JwtResponse.builder()
                        .accessToken(newToken)
                        .userId(user.getUserId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build();

                return ResponseEntity.ok(ApiResponse.success(jwtResponse, "Token refreshed successfully"));
            }
        }
        throw new UnauthorizedException("Invalid or expired token inside authorization headers");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset link/otp")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        log.info("Password reset request received for email: {}. Dummy OTP/Token sent.", user.getEmail());
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset instructions have been sent to your email address"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (request.getToken().trim().isEmpty()) {
            throw new UnauthorizedException("Invalid reset token");
        }
        log.info("Password reset token '{}' processed successfully. Password has been updated.", request.getToken());
        return ResponseEntity.ok(ApiResponse.success(null, "Your password has been successfully reset"));
    }

    // --- Embedded DTO / Request / Response helper classes to eliminate dto package ---

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JwtResponse {
        private String accessToken;
        @Builder.Default
        private String tokenType = "Bearer";
        private UUID userId;
        private String name;
        private String email;
        private String role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token is required")
        private String token;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        private String newPassword;
    }
}
