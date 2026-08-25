package com.pbfm.controller;

import com.pbfm.entity.Account;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.AccountRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "Endpoints for managing bank accounts")
@Slf4j
public class AccountController {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a new bank account")
    public ResponseEntity<ApiResponse<Account>> createAccount(@Valid @RequestBody Account request) {
        log.info("Received request to create account for user ID: {}, type: {}", request.getUserId(), request.getAccountType());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        request.setUser(user);
        Account savedAccount = accountRepository.save(request);

        log.info("Account created successfully with ID: {}", savedAccount.getAccountId());
        return new ResponseEntity<>(
                ApiResponse.success(savedAccount, "Account created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID")
    public ResponseEntity<ApiResponse<Account>> getAccountById(@PathVariable UUID id) {
        log.info("Fetching account by ID: {}", id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(account));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing account")
    public ResponseEntity<ApiResponse<Account>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody Account request) {
        log.info("Updating account with ID: {}", id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        account.setAccountName(request.getAccountName());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        Account updatedAccount = accountRepository.save(account);

        log.info("Account with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedAccount, "Account updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an account (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable UUID id) {
        log.info("Deleting account with ID: {}", id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        accountRepository.delete(account);
        log.info("Account with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Account deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all accounts for a specific user")
    public ResponseEntity<ApiResponse<List<Account>>> getAccountsByUserId(@PathVariable UUID userId) {
        log.info("Fetching accounts for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        log.info("Found {} accounts for user ID: {}", accounts.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    @GetMapping("/user/{userId}/net-worth")
    @Operation(summary = "Get total net worth for a specific user")
    public ResponseEntity<ApiResponse<BigDecimal>> getNetWorthByUserId(@PathVariable UUID userId) {
        log.info("Calculating net worth for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        BigDecimal netWorth = accountRepository.getNetWorthByUserId(userId);
        log.info("Net worth for user ID: {} is {}", userId, netWorth);
        return ResponseEntity.ok(ApiResponse.success(netWorth));
    }
}
