package com.pbfm.dto.request;

import com.pbfm.enums.RewardStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardUpdateRequest {

    @NotNull(message = "Status is required")
    private RewardStatus status;

    private LocalDate redeemedDate;
}
