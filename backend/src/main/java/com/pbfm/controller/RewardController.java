package com.pbfm.controller;

import com.pbfm.dto.request.RewardCreateRequest;
import com.pbfm.dto.request.RewardUpdateRequest;
import com.pbfm.dto.response.RewardResponse;
import com.pbfm.entity.Account;
import com.pbfm.entity.Reward;
import com.pbfm.entity.User;
import com.pbfm.enums.RewardStatus;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.RewardMapper;
import com.pbfm.repository.AccountRepository;
import com.pbfm.repository.RewardRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
@Tag(name = "Reward Management", description = "Endpoints for managing cashbacks and financial rewards")
public class RewardController {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RewardMapper rewardMapper;

    @PostMapping
    @Operation(summary = "Log/Create a new reward manually")
    public ResponseEntity<ApiResponse<RewardResponse>> createReward(@Valid @RequestBody RewardCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        Reward reward = rewardMapper.toEntity(request);
        reward.setUser(user);
        reward.setAccount(account);
        if (reward.getEarnedDate() == null) {
            reward.setEarnedDate(LocalDate.now());
        }

        Reward savedReward = rewardRepository.save(reward);

        return new ResponseEntity<>(
                ApiResponse.success(rewardMapper.toResponse(savedReward), "Reward recorded successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reward by ID")
    public ResponseEntity<ApiResponse<RewardResponse>> getRewardById(@PathVariable UUID id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(rewardMapper.toResponse(reward)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a reward (Redeem or expire)")
    public ResponseEntity<ApiResponse<RewardResponse>> updateReward(
            @PathVariable UUID id,
            @Valid @RequestBody RewardUpdateRequest request) {

        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        rewardMapper.updateEntityFromDto(request, reward);
        
        // If status is being updated to REDEEMED, record the redeemed date
        if (request.getStatus() == RewardStatus.REDEEMED) {
            reward.setRedeemedDate(LocalDate.now());
        }

        Reward updatedReward = rewardRepository.save(reward);
        return ResponseEntity.ok(ApiResponse.success(rewardMapper.toResponse(updatedReward), "Reward updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reward (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteReward(@PathVariable UUID id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        rewardRepository.delete(reward);
        return ResponseEntity.ok(ApiResponse.success(null, "Reward deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all rewards for a user")
    public ResponseEntity<ApiResponse<List<RewardResponse>>> getRewardsByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Reward> rewards = rewardRepository.findByUser_UserId(userId);
        List<RewardResponse> responses = rewards.stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
