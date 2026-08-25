package com.pbfm.controller;

import com.pbfm.entity.Budget;
import com.pbfm.entity.Category;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.BudgetRepository;
import com.pbfm.repository.CategoryRepository;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management", description = "Endpoints for setting and checking user budgets")
@Slf4j
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping
    @Operation(summary = "Set a new budget")
    public ResponseEntity<ApiResponse<Budget>> createBudget(@Valid @RequestBody Budget request) {
        log.info("Creating budget for user ID: {}, category ID: {}, limit: {}", request.getUserId(), request.getCategoryId(), request.getLimitAmount());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        request.setUser(user);
        request.setCategory(category);
        Budget savedBudget = budgetRepository.save(request);

        log.info("Budget created successfully with ID: {}", savedBudget.getBudgetId());
        return new ResponseEntity<>(
                ApiResponse.success(savedBudget, "Budget created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<ApiResponse<Budget>> getBudgetById(@PathVariable UUID id) {
        log.info("Fetching budget by ID: {}", id);
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(budget));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing budget")
    public ResponseEntity<ApiResponse<Budget>> updateBudget(
            @PathVariable UUID id,
            @Valid @RequestBody Budget request) {
        log.info("Updating budget with ID: {}", id);
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            budget.setCategory(category);
        }

        budget.setLimitAmount(request.getLimitAmount());
        budget.setPeriod(request.getPeriod());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
        Budget updatedBudget = budgetRepository.save(budget);

        log.info("Budget with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedBudget, "Budget updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable UUID id) {
        log.info("Deleting budget with ID: {}", id);
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetRepository.delete(budget);
        log.info("Budget with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Budget deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all budgets for a user")
    public ResponseEntity<ApiResponse<List<Budget>>> getBudgetsByUserId(@PathVariable UUID userId) {
        log.info("Fetching all budgets for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Budget> budgets = budgetRepository.findByUser_UserId(userId);
        log.info("Found {} budgets for user ID: {}", budgets.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }
}
