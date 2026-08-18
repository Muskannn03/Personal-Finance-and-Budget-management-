package com.pbfm.dto.response;

import com.pbfm.enums.RewardStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardResponse {
    private UUID rewardId;
    private UUID userId;
    private UUID accountId;
    private UUID sourceTransactionId;
    private String rewardType;
    private BigDecimal amount;
    private RewardStatus status;
    private LocalDate earnedDate;
    private LocalDate expiryDate;
    private LocalDate redeemedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
