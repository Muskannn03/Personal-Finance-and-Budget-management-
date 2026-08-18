package com.pbfm.controller;

import com.pbfm.dto.request.RiskProfileCreateRequest;
import com.pbfm.dto.request.RiskProfileUpdateRequest;
import com.pbfm.dto.response.RiskProfileResponse;
import com.pbfm.entity.RiskProfile;
import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.RiskProfileMapper;
import com.pbfm.repository.RiskProfileRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/risk-profiles")
@RequiredArgsConstructor
@Tag(name = "Risk Profile Management", description = "Endpoints for managing user financial risk profiles")
public class RiskProfileController {

    private final RiskProfileRepository riskProfileRepository;
    private final UserRepository userRepository;
    private final RiskProfileMapper riskProfileMapper;

    @PostMapping
    @Operation(summary = "Create user risk profile (1:1 constraint)")
    public ResponseEntity<ApiResponse<RiskProfileResponse>> createRiskProfile(@Valid @RequestBody RiskProfileCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Ensure 1:1 uniqueness constraint
        if (riskProfileRepository.findByUser_UserId(request.getUserId()).isPresent()) {
            throw new DuplicateResourceException("Risk profile already exists for user: " + request.getUserId());
        }

        RiskProfile riskProfile = riskProfileMapper.toEntity(request);
        riskProfile.setUser(user);
        RiskProfile savedProfile = riskProfileRepository.save(riskProfile);

        return new ResponseEntity<>(
                ApiResponse.success(riskProfileMapper.toResponse(savedProfile), "Risk profile created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get risk profile by ID")
    public ResponseEntity<ApiResponse<RiskProfileResponse>> getRiskProfileById(@PathVariable UUID id) {
        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(riskProfileMapper.toResponse(riskProfile)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update risk profile details")
    public ResponseEntity<ApiResponse<RiskProfileResponse>> updateRiskProfile(
            @PathVariable UUID id,
            @Valid @RequestBody RiskProfileUpdateRequest request) {

        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        riskProfileMapper.updateEntityFromDto(request, riskProfile);
        RiskProfile updatedProfile = riskProfileRepository.save(riskProfile);

        return ResponseEntity.ok(ApiResponse.success(riskProfileMapper.toResponse(updatedProfile), "Risk profile updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete risk profile (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteRiskProfile(@PathVariable UUID id) {
        RiskProfile riskProfile = riskProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found with id: " + id));

        riskProfileRepository.delete(riskProfile);
        return ResponseEntity.ok(ApiResponse.success(null, "Risk profile deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get risk profile for a specific user")
    public ResponseEntity<ApiResponse<RiskProfileResponse>> getRiskProfileByUserId(@PathVariable UUID userId) {
        RiskProfile riskProfile = riskProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Risk profile not found for user: " + userId));

        return ResponseEntity.ok(ApiResponse.success(riskProfileMapper.toResponse(riskProfile)));
    }
}
