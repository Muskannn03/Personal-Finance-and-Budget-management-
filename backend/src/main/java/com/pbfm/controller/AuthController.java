package com.pbfm.controller;

import com.pbfm.dto.request.ForgotPasswordRequest;
import com.pbfm.dto.request.LoginRequest;
import com.pbfm.dto.request.ResetPasswordRequest;
import com.pbfm.dto.request.UserCreateRequest;
import com.pbfm.dto.response.JwtResponse;
import com.pbfm.dto.response.UserResponse;
import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.exception.UnauthorizedException;
import com.pbfm.mapper.UserMapper;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import com.pbfm.security.JwtTokenProvider;
import com.pbfm.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Authorization", description = "Endpoints for login, registration, token refresh, and password recovery")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER"); // Default role is standard USER
        User savedUser = userRepository.save(user);

        return new ResponseEntity<>(
                ApiResponse.success(userMapper.toResponse(savedUser), "User registered successfully"),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and retrieve access token")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest request) {
        log.info("Attempting login authentication for user email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
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
                User user = userRepository.findByEmail(email)
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
        
        // Return placeholder success message
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset instructions have been sent to your email address"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        // Mock token verification - for mock purposes, any non-blank token acts as a placeholder
        if (request.getToken().trim().isEmpty()) {
            throw new UnauthorizedException("Invalid reset token");
        }

        // In a real application, we would lookup user by reset token.
        // For security mockup, we will allow updating a sample seed user or log it
        log.info("Password reset token '{}' processed successfully. Password has been updated.", request.getToken());

        return ResponseEntity.ok(ApiResponse.success(null, "Your password has been successfully reset"));
    }
}
