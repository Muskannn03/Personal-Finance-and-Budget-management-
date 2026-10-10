package com.pbfm.response;

import com.pbfm.entity.Reward;
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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardResponse {

    private UUID rewardId;
    private UUID userId;
    private UUID accountId;
    private String accountName;
    private UUID sourceTransactionId;
    private String rewardType;
    private BigDecimal amount;
    private RewardStatus status;
    private LocalDate earnedDate;
    private LocalDate expiryDate;
    private LocalDate redeemedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static RewardResponse fromEntity(Reward reward) {
        if (reward == null) {
            return null;
        }
        return RewardResponse.builder()
                .rewardId(reward.getRewardId())
                .userId(reward.getUserId())
                .accountId(reward.getAccountId())
                .accountName(reward.getAccount() != null ? reward.getAccount().getAccountName() : null)
                .sourceTransactionId(reward.getSourceTransactionId())
                .rewardType(reward.getRewardType())
                .amount(reward.getAmount())
                .status(reward.getStatus())
                .earnedDate(reward.getEarnedDate())
                .expiryDate(reward.getExpiryDate())
                .redeemedDate(reward.getRedeemedDate())
                .createdAt(reward.getCreatedAt())
                .updatedAt(reward.getUpdatedAt())
                .createdBy(reward.getCreatedBy())
                .updatedBy(reward.getUpdatedBy())
                .build();
    }
}
