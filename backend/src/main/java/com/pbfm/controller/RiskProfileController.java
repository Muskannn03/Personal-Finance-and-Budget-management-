package com.pbfm.controller;

import com.pbfm.entity.RiskProfile;
import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.RiskProfileRepository;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/risk-profiles")
@RequiredArgsConstructor
@Tag(name = "Risk Profile Management", description = "Endpoints for managing user financial risk profiles")
@Slf4j
public class RiskProfileController {

    private final RiskProfileRepository riskProfileRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create user risk profile (1:1 constraint)")
    public ResponseEntity<ApiResponse<RiskProfile>> createRiskProfile(@Valid @RequestBody RiskProfile request) {
        log.info("Creating risk profile for user ID: {} with score: {}", request.getUserId(), request.getRiskScore());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Ensure 1:1 uniqueness constraint
        if (riskProfileRepository.findByUser_UserId(request.getUserId()).isPresent()) {
            throw new DuplicateResourceException("Risk profile already exists for user: " + request.getUserId());
        }

        request.setUser(user);
        RiskProfile savedProfile = riskProfileRepository.save(request);

        log.info("Risk profile created successfully with ID: {}", savedProfile.getProfileId());
        return new ResponseEntity<>(
                ApiResponse.success(savedProfile, "Risk profile created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get risk profile by ID")
    public ResponseEntity<ApiResponse<RiskProfile>> getRiskProfileById(@PathVariable UUID id) {
        log.info("Fetching risk profile by ID: {}", id);
        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(riskProfile));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update risk profile details")
    public ResponseEntity<ApiResponse<RiskProfile>> updateRiskProfile(
            @PathVariable UUID id,
            @Valid @RequestBody RiskProfile request) {
        log.info("Updating risk profile with ID: {}", id);
        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        riskProfile.setRiskScore(request.getRiskScore());
        riskProfile.setProfileType(request.getProfileType());
        RiskProfile updatedProfile = riskProfileRepository.save(riskProfile);

        log.info("Risk profile with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Risk profile updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete risk profile (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteRiskProfile(@PathVariable UUID id) {
        log.info("Deleting risk profile with ID: {}", id);
        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        riskProfileRepository.delete(riskProfile);
        log.info("Risk profile with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Risk profile deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get risk profile for a specific user")
    public ResponseEntity<ApiResponse<RiskProfile>> getRiskProfileByUserId(@PathVariable UUID userId) {
        log.info("Fetching risk profile for user ID: {}", userId);
        RiskProfile riskProfile = riskProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found for user: " + userId));

        return ResponseEntity.ok(ApiResponse.success(riskProfile));
    }
}
