package com.pbfm.controller;

import com.pbfm.dto.request.AccountCreateRequest;
import com.pbfm.dto.request.AccountUpdateRequest;
import com.pbfm.dto.response.AccountResponse;
import com.pbfm.entity.Account;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.AccountMapper;
import com.pbfm.repository.AccountRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "Endpoints for managing bank accounts")
public class AccountController {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountMapper accountMapper;

    @PostMapping
    @Operation(summary = "Create a new bank account")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(@Valid @RequestBody AccountCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Account account = accountMapper.toEntity(request);
        account.setUser(user);
        Account savedAccount = accountRepository.save(account);

        return new ResponseEntity<>(
                ApiResponse.success(accountMapper.toResponse(savedAccount), "Account created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(@PathVariable UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(accountMapper.toResponse(account)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing account")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody AccountUpdateRequest request) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        accountMapper.updateEntityFromDto(request, account);
        Account updatedAccount = accountRepository.save(account);

        return ResponseEntity.ok(ApiResponse.success(accountMapper.toResponse(updatedAccount), "Account updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an account (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        accountRepository.delete(account);
        return ResponseEntity.ok(ApiResponse.success(null, "Account deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all accounts for a specific user")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccountsByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<AccountResponse> responses = accounts.stream()
                .map(accountMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/user/{userId}/net-worth")
    @Operation(summary = "Get total net worth for a specific user")
    public ResponseEntity<ApiResponse<BigDecimal>> getNetWorthByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        BigDecimal netWorth = accountRepository.getNetWorthByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(netWorth));
    }
}
