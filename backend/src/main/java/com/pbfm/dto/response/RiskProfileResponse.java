package com.pbfm.dto.response;

import com.pbfm.enums.ProfileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskProfileResponse {
    private UUID profileId;
    private UUID userId;
    private Integer riskScore;
    private ProfileType profileType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
