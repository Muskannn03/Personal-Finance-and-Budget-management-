package com.pbfm.controller;

import com.pbfm.dto.request.GoalCreateRequest;
import com.pbfm.dto.request.GoalUpdateRequest;
import com.pbfm.dto.response.GoalResponse;
import com.pbfm.entity.Goal;
import com.pbfm.entity.User;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.GoalMapper;
import com.pbfm.repository.GoalRepository;
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
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@Tag(name = "Goal Management", description = "Endpoints for managing savings and purchase goals")
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final GoalMapper goalMapper;

    @PostMapping
    @Operation(summary = "Create a new goal")
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(@Valid @RequestBody GoalCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Goal goal = goalMapper.toEntity(request);
        goal.setUser(user);
        Goal savedGoal = goalRepository.save(goal);

        return new ResponseEntity<>(
                ApiResponse.success(goalMapper.toResponse(savedGoal), "Goal created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get goal by ID")
    public ResponseEntity<ApiResponse<GoalResponse>> getGoalById(@PathVariable UUID id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(goalMapper.toResponse(goal)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing goal")
    public ResponseEntity<ApiResponse<GoalResponse>> updateGoal(
            @PathVariable UUID id,
            @Valid @RequestBody GoalUpdateRequest request) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        goalMapper.updateEntityFromDto(request, goal);
        Goal updatedGoal = goalRepository.save(goal);

        return ResponseEntity.ok(ApiResponse.success(goalMapper.toResponse(updatedGoal), "Goal updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a goal (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable UUID id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        goalRepository.delete(goal);
        return ResponseEntity.ok(ApiResponse.success(null, "Goal deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all goals for a specific user")
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoalsByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Goal> goals = goalRepository.findByUser_UserId(userId);
        List<GoalResponse> responses = goals.stream()
                .map(goalMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
