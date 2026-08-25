package com.pbfm.controller;

import com.pbfm.entity.Goal;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.GoalRepository;
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
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@Tag(name = "Goal Management", description = "Endpoints for managing savings and purchase goals")
@Slf4j
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a new goal")
    public ResponseEntity<ApiResponse<Goal>> createGoal(@Valid @RequestBody Goal request) {
        log.info("Creating goal '{}' with target amount {} for user ID: {}", request.getGoalName(), request.getTargetAmount(), request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        request.setUser(user);
        Goal savedGoal = goalRepository.save(request);

        log.info("Goal created successfully with ID: {}", savedGoal.getGoalId());
        return new ResponseEntity<>(
                ApiResponse.success(savedGoal, "Goal created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get goal by ID")
    public ResponseEntity<ApiResponse<Goal>> getGoalById(@PathVariable UUID id) {
        log.info("Fetching goal by ID: {}", id);
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(goal));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing goal")
    public ResponseEntity<ApiResponse<Goal>> updateGoal(
            @PathVariable UUID id,
            @Valid @RequestBody Goal request) {
        log.info("Updating goal with ID: {}", id);
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());
        goal.setStatus(request.getStatus());
        Goal updatedGoal = goalRepository.save(goal);

        log.info("Goal with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedGoal, "Goal updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a goal (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable UUID id) {
        log.info("Deleting goal with ID: {}", id);
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        goalRepository.delete(goal);
        log.info("Goal with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Goal deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all goals for a specific user")
    public ResponseEntity<ApiResponse<List<Goal>>> getGoalsByUserId(@PathVariable UUID userId) {
        log.info("Fetching all goals for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Goal> goals = goalRepository.findByUser_UserId(userId);
        log.info("Found {} goals for user ID: {}", goals.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(goals));
    }
}
