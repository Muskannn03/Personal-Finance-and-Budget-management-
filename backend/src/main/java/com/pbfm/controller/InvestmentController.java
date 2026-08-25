package com.pbfm.controller;

import com.pbfm.entity.Goal;
import com.pbfm.entity.Investment;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.GoalRepository;
import com.pbfm.repository.InvestmentRepository;
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
@RequestMapping("/api/v1/investments")
@RequiredArgsConstructor
@Tag(name = "Investment Management", description = "Endpoints for recording savings/equity investments")
@Slf4j
public class InvestmentController {

    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;

    @PostMapping
    @Operation(summary = "Record a new investment")
    public ResponseEntity<ApiResponse<Investment>> createInvestment(@Valid @RequestBody Investment request) {
        log.info("Creating investment of type {} with amount {} for user ID: {}", request.getType(), request.getAmount(), request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Goal goal = null;
        if (request.getGoalId() != null) {
            goal = goalRepository.findById(request.getGoalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + request.getGoalId()));
        }

        request.setUser(user);
        request.setGoal(goal);
        Investment savedInvestment = investmentRepository.save(request);

        log.info("Investment recorded successfully with ID: {}", savedInvestment.getInvestmentId());
        return new ResponseEntity<>(
                ApiResponse.success(savedInvestment, "Investment recorded successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get investment by ID")
    public ResponseEntity<ApiResponse<Investment>> getInvestmentById(@PathVariable UUID id) {
        log.info("Fetching investment by ID: {}", id);
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(investment));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing investment")
    public ResponseEntity<ApiResponse<Investment>> updateInvestment(
            @PathVariable UUID id,
            @Valid @RequestBody Investment request) {
        log.info("Updating investment with ID: {}", id);
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        Goal goal = null;
        if (request.getGoalId() != null) {
            goal = goalRepository.findById(request.getGoalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + request.getGoalId()));
        }

        investment.setType(request.getType());
        investment.setAmount(request.getAmount());
        investment.setStartDate(request.getStartDate());
        investment.setMaturityDate(request.getMaturityDate());
        investment.setCurrentValue(request.getCurrentValue());
        investment.setGoal(goal);
        
        Investment updatedInvestment = investmentRepository.save(investment);

        log.info("Investment with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedInvestment, "Investment updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an investment (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteInvestment(@PathVariable UUID id) {
        log.info("Deleting investment with ID: {}", id);
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        investmentRepository.delete(investment);
        log.info("Investment with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Investment deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all investments for a user")
    public ResponseEntity<ApiResponse<List<Investment>>> getInvestmentsByUserId(@PathVariable UUID userId) {
        log.info("Fetching all investments for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Investment> investments = investmentRepository.findByUser_UserId(userId);
        log.info("Found {} investments for user ID: {}", investments.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(investments));
    }

    @GetMapping("/goal/{goalId}")
    @Operation(summary = "Get all investments linked to a goal")
    public ResponseEntity<ApiResponse<List<Investment>>> getInvestmentsByGoalId(@PathVariable UUID goalId) {
        log.info("Fetching all investments linked to goal ID: {}", goalId);
        if (!goalRepository.existsById(goalId)) {
            throw new ResourceNotFoundException("Goal not found with id: " + goalId);
        }
        List<Investment> investments = investmentRepository.findByGoal_GoalId(goalId);
        log.info("Found {} investments linked to goal ID: {}", investments.size(), goalId);
        return ResponseEntity.ok(ApiResponse.success(investments));
    }
}
