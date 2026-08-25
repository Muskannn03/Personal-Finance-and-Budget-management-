package com.pbfm.controller;

import com.pbfm.entity.Account;
import com.pbfm.entity.Reward;
import com.pbfm.entity.User;
import com.pbfm.enums.RewardStatus;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.AccountRepository;
import com.pbfm.repository.RewardRepository;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
@Tag(name = "Reward Management", description = "Endpoints for managing cashbacks and financial rewards")
@Slf4j
public class RewardController {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @PostMapping
    @Operation(summary = "Log/Create a new reward manually")
    public ResponseEntity<ApiResponse<Reward>> createReward(@Valid @RequestBody Reward request) {
        log.info("Creating a new reward of type {} with amount {} for user ID: {}", request.getRewardType(), request.getAmount(), request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        request.setUser(user);
        request.setAccount(account);
        if (request.getEarnedDate() == null) {
            request.setEarnedDate(LocalDate.now());
        }

        Reward savedReward = rewardRepository.save(request);

        log.info("Reward recorded successfully with ID: {}", savedReward.getRewardId());
        return new ResponseEntity<>(
                ApiResponse.success(savedReward, "Reward recorded successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reward by ID")
    public ResponseEntity<ApiResponse<Reward>> getRewardById(@PathVariable UUID id) {
        log.info("Fetching reward by ID: {}", id);
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(reward));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a reward (Redeem or expire)")
    public ResponseEntity<ApiResponse<Reward>> updateReward(
            @PathVariable UUID id,
            @Valid @RequestBody Reward request) {
        log.info("Updating reward with ID: {} to status: {}", id, request.getStatus());
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        reward.setRewardType(request.getRewardType());
        reward.setAmount(request.getAmount());
        reward.setStatus(request.getStatus());
        reward.setExpiryDate(request.getExpiryDate());

        if (request.getAccountId() != null) {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));
            reward.setAccount(account);
        }

        // If status is being updated to REDEEMED, record the redeemed date
        if (request.getStatus() == RewardStatus.REDEEMED) {
            reward.setRedeemedDate(LocalDate.now());
        }

        Reward updatedReward = rewardRepository.save(reward);
        log.info("Reward with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedReward, "Reward updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reward (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteReward(@PathVariable UUID id) {
        log.info("Deleting reward with ID: {}", id);
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        rewardRepository.delete(reward);
        log.info("Reward with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reward deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all rewards for a user")
    public ResponseEntity<ApiResponse<List<Reward>>> getRewardsByUserId(@PathVariable UUID userId) {
        log.info("Fetching all rewards for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Reward> rewards = rewardRepository.findByUser_UserId(userId);
        log.info("Found {} rewards for user ID: {}", rewards.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(rewards));
    }
}
