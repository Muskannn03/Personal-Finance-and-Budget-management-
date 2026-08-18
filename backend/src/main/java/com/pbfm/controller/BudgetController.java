package com.pbfm.controller;

import com.pbfm.dto.request.BudgetCreateRequest;
import com.pbfm.dto.request.BudgetUpdateRequest;
import com.pbfm.dto.response.BudgetResponse;
import com.pbfm.entity.Budget;
import com.pbfm.entity.Category;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.BudgetMapper;
import com.pbfm.repository.BudgetRepository;
import com.pbfm.repository.CategoryRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management", description = "Endpoints for setting and checking user budgets")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetMapper budgetMapper;

    @PostMapping
    @Operation(summary = "Set a new budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(@Valid @RequestBody BudgetCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Budget budget = budgetMapper.toEntity(request);
        budget.setUser(user);
        budget.setCategory(category);
        Budget savedBudget = budgetRepository.save(budget);

        return new ResponseEntity<>(
                ApiResponse.success(budgetMapper.toResponse(savedBudget), "Budget created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(@PathVariable UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(budgetMapper.toResponse(budget)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @PathVariable UUID id,
            @Valid @RequestBody BudgetUpdateRequest request) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetMapper.updateEntityFromDto(request, budget);
        Budget updatedBudget = budgetRepository.save(budget);

        return ResponseEntity.ok(ApiResponse.success(budgetMapper.toResponse(updatedBudget), "Budget updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetRepository.delete(budget);
        return ResponseEntity.ok(ApiResponse.success(null, "Budget deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all budgets for a user")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Budget> budgets = budgetRepository.findByUser_UserId(userId);
        List<BudgetResponse> responses = budgets.stream()
                .map(budgetMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
