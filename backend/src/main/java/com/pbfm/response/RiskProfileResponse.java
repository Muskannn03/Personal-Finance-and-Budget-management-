package com.pbfm.response;

import com.pbfm.entity.RiskProfile;
import com.pbfm.enums.ProfileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskProfileResponse {

    private UUID profileId;
    private UUID userId;
    private Integer riskScore;
    private ProfileType profileType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static RiskProfileResponse fromEntity(RiskProfile riskProfile) {
        if (riskProfile == null) {
            return null;
        }
        return RiskProfileResponse.builder()
                .profileId(riskProfile.getProfileId())
                .userId(riskProfile.getUserId())
                .riskScore(riskProfile.getRiskScore())
                .profileType(riskProfile.getProfileType())
                .createdAt(riskProfile.getCreatedAt())
                .updatedAt(riskProfile.getUpdatedAt())
                .createdBy(riskProfile.getCreatedBy())
                .updatedBy(riskProfile.getUpdatedBy())
                .build();
    }
}
