package com.pbfm.response;

import com.pbfm.entity.Investment;
import com.pbfm.enums.InvestmentType;
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
public class InvestmentResponse {

    private UUID investmentId;
    private UUID userId;
    private UUID goalId;
    private String goalName;
    private InvestmentType type;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private BigDecimal currentValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static InvestmentResponse fromEntity(Investment investment) {
        if (investment == null) {
            return null;
        }
        return InvestmentResponse.builder()
                .investmentId(investment.getInvestmentId())
                .userId(investment.getUserId())
                .goalId(investment.getGoalId())
                .goalName(investment.getGoal() != null ? investment.getGoal().getGoalName() : null)
                .type(investment.getType())
                .amount(investment.getAmount())
                .startDate(investment.getStartDate())
                .maturityDate(investment.getMaturityDate())
                .currentValue(investment.getCurrentValue())
                .createdAt(investment.getCreatedAt())
                .updatedAt(investment.getUpdatedAt())
                .createdBy(investment.getCreatedBy())
                .updatedBy(investment.getUpdatedBy())
                .build();
    }
}
