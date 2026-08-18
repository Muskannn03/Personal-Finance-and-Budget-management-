package com.pbfm.controller;

import com.pbfm.dto.request.InvestmentCreateRequest;
import com.pbfm.dto.request.InvestmentUpdateRequest;
import com.pbfm.dto.response.InvestmentResponse;
import com.pbfm.entity.Goal;
import com.pbfm.entity.Investment;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.InvestmentMapper;
import com.pbfm.repository.GoalRepository;
import com.pbfm.repository.InvestmentRepository;
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
@RequestMapping("/api/v1/investments")
@RequiredArgsConstructor
@Tag(name = "Investment Management", description = "Endpoints for recording savings/equity investments")
public class InvestmentController {

    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final InvestmentMapper investmentMapper;

    @PostMapping
    @Operation(summary = "Record a new investment")
    public ResponseEntity<ApiResponse<InvestmentResponse>> createInvestment(@Valid @RequestBody InvestmentCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Goal goal = null;
        if (request.getGoalId() != null) {
            goal = goalRepository.findById(request.getGoalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + request.getGoalId()));
        }

        Investment investment = investmentMapper.toEntity(request);
        investment.setUser(user);
        investment.setGoal(goal);
        Investment savedInvestment = investmentRepository.save(investment);

        return new ResponseEntity<>(
                ApiResponse.success(investmentMapper.toResponse(savedInvestment), "Investment recorded successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get investment by ID")
    public ResponseEntity<ApiResponse<InvestmentResponse>> getInvestmentById(@PathVariable UUID id) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(investmentMapper.toResponse(investment)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing investment")
    public ResponseEntity<ApiResponse<InvestmentResponse>> updateInvestment(
            @PathVariable UUID id,
            @Valid @RequestBody InvestmentUpdateRequest request) {

        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        Goal goal = null;
        if (request.getGoalId() != null) {
            goal = goalRepository.findById(request.getGoalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + request.getGoalId()));
        }

        investmentMapper.updateEntityFromDto(request, investment);
        investment.setGoal(goal);
        Investment updatedInvestment = investmentRepository.save(investment);

        return ResponseEntity.ok(ApiResponse.success(investmentMapper.toResponse(updatedInvestment), "Investment updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an investment (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteInvestment(@PathVariable UUID id) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        investmentRepository.delete(investment);
        return ResponseEntity.ok(ApiResponse.success(null, "Investment deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all investments for a user")
    public ResponseEntity<ApiResponse<List<InvestmentResponse>>> getInvestmentsByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Investment> investments = investmentRepository.findByUser_UserId(userId);
        List<InvestmentResponse> responses = investments.stream()
                .map(investmentMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/goal/{goalId}")
    @Operation(summary = "Get all investments linked to a goal")
    public ResponseEntity<ApiResponse<List<InvestmentResponse>>> getInvestmentsByGoalId(@PathVariable UUID goalId) {
        if (!goalRepository.existsById(goalId)) {
            throw new ResourceNotFoundException("Goal not found with id: " + goalId);
        }
        List<Investment> investments = investmentRepository.findByGoal_GoalId(goalId);
        List<InvestmentResponse> responses = investments.stream()
                .map(investmentMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
