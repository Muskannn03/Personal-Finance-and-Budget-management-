package com.pbfm.controller;

import com.pbfm.entity.*;
import com.pbfm.enums.ReminderStatus;
import com.pbfm.enums.RewardStatus;
import com.pbfm.enums.TransactionType;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.*;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Management", description = "Endpoints for managing transaction records")
@Slf4j
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final RewardRepository rewardRepository;
    private final BudgetRepository budgetRepository;
    private final ReminderRepository reminderRepository;

    @PostMapping
    @Operation(summary = "Record a new transaction")
    @Transactional
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(@Valid @RequestBody Transaction request) {
        log.info("Recording a new transaction of type {} with amount {} for user ID: {}", request.getType(), request.getAmount(), request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        request.setUser(user);
        request.setAccount(account);
        request.setCategory(category);
        if (request.getDate() == null) {
            request.setDate(LocalDateTime.now());
        }

        Transaction savedTransaction = transactionRepository.save(request);
        log.info("Transaction recorded successfully with ID: {}", savedTransaction.getTransactionId());

        // --- BUSINESS RULE: Check Budget Breaches on Expenses ---
        if (savedTransaction.getType() == TransactionType.EXPENSE && category != null) {
            checkAndHandleBudgetBreach(user, category, savedTransaction);
        }

        // --- BUSINESS RULE: Cashback Reward Auto-Generation ---
        if (savedTransaction.getType() == TransactionType.EXPENSE && category != null && 
            "Shopping".equalsIgnoreCase(category.getCategoryName()) && 
            savedTransaction.getAmount().compareTo(new BigDecimal("500.00")) > 0) {
            generateCashbackReward(user, account, savedTransaction);
        }

        return new ResponseEntity<>(
                ApiResponse.success(savedTransaction, "Transaction recorded successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<ApiResponse<Transaction>> getTransactionById(@PathVariable UUID id) {
        log.info("Fetching transaction by ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing transaction")
    @Transactional
    public ResponseEntity<ApiResponse<Transaction>> updateTransaction(
            @PathVariable UUID id,
            @Valid @RequestBody Transaction request) {
        log.info("Updating transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);
        
        if (request.getAccountId() != null) {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));
            transaction.setAccount(account);
        }

        Transaction updatedTransaction = transactionRepository.save(transaction);
        log.info("Transaction with ID: {} updated successfully", id);

        // Check budget breaches on update if transaction is an expense
        if (updatedTransaction.getType() == TransactionType.EXPENSE && category != null) {
            checkAndHandleBudgetBreach(updatedTransaction.getUser(), category, updatedTransaction);
        }

        return ResponseEntity.ok(ApiResponse.success(updatedTransaction, "Transaction updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a transaction (soft delete)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable UUID id) {
        log.info("Deleting transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        transactionRepository.delete(transaction);
        log.info("Transaction with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Transaction deleted successfully"));
    }

    @GetMapping
    @Operation(summary = "Search and filter transactions pageably")
    public ResponseEntity<ApiResponse<Page<Transaction>>> getTransactions(
            @RequestParam UUID userId,
            @RequestParam(required = false) UUID accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.info("Searching and filtering transactions pageably for user ID: {}, account ID: {}", userId, accountId);

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Page<Transaction> transactionPage = transactionRepository.findFilteredTransactions(userId, accountId, startDate, endDate, pageable);
        log.info("Found {} transactions in the requested page for user ID: {}", transactionPage.getNumberOfElements(), userId);

        return ResponseEntity.ok(ApiResponse.success(transactionPage));
    }

    private void checkAndHandleBudgetBreach(User user, Category category, Transaction transaction) {
        LocalDate localDate = transaction.getDate().toLocalDate();
        Optional<Budget> activeBudgetOpt = budgetRepository.findActiveBudget(user.getUserId(), category.getCategoryId(), localDate);

        if (activeBudgetOpt.isPresent()) {
            Budget budget = activeBudgetOpt.get();
            LocalDateTime start = budget.getStartDate().atStartOfDay();
            LocalDateTime end = budget.getEndDate().atTime(23, 59, 59);

            // Compute total expenses for this category in the current budget range
            BigDecimal currentTotal = transactionRepository.getTotalAmountByCategoryIdAndTypeInDateRange(
                    user.getUserId(), category.getCategoryId(), TransactionType.EXPENSE, start, end);

            if (currentTotal.compareTo(budget.getLimitAmount()) > 0) {
                log.warn("BUDGET EXCEEDED! User: {}, Category: {}, Limit: {}, Current Spend: {}",
                        user.getEmail(), category.getCategoryName(), budget.getLimitAmount(), currentTotal);

                // Auto-create a pending reminder notify alert
                Reminder reminder = Reminder.builder()
                        .user(user)
                        .title("Budget Exceeded Warning for Category: " + category.getCategoryName() + 
                               " (Limit: " + budget.getLimitAmount() + ", Current Spend: " + currentTotal + ")")
                        .relatedType("BUDGET")
                        .relatedId(budget.getBudgetId())
                        .dueDate(LocalDateTime.now())
                        .status(ReminderStatus.PENDING)
                        .build();

                reminderRepository.save(reminder);
            }
        }
    }

    private void generateCashbackReward(User user, Account account, Transaction transaction) {
        // Cashback is 1% of transaction amount
        BigDecimal cashbackAmount = transaction.getAmount().multiply(new BigDecimal("0.01"))
                .setScale(2, RoundingMode.HALF_UP);

        log.info("Generating automatic 1% cashback reward of Rs. {} on shopping transaction over Rs. 500 for user {}",
                cashbackAmount, user.getEmail());

        Reward reward = Reward.builder()
                .user(user)
                .account(account)
                .sourceTransaction(transaction)
                .rewardType("CASHBACK_1_PERCENT")
                .amount(cashbackAmount)
                .status(RewardStatus.EARNED)
                .earnedDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(1))
                .build();

        rewardRepository.save(reward);

        // Credit the account balance programmatically
        account.setBalance(account.getBalance().add(cashbackAmount));
        accountRepository.save(account);
    }
}
