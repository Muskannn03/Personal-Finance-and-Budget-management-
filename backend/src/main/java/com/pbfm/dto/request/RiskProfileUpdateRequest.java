package com.pbfm.dto.request;

import com.pbfm.enums.ProfileType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskProfileUpdateRequest {

    @NotNull(message = "Risk score is required")
    private Integer riskScore;

    @NotNull(message = "Profile type is required")
    private ProfileType profileType;
}
