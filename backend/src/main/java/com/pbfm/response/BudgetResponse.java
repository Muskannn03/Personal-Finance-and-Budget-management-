package com.pbfm.response;

import com.pbfm.entity.Budget;
import com.pbfm.enums.BudgetPeriod;
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
public class BudgetResponse {

    private UUID budgetId;
    private UUID userId;
    private UUID categoryId;
    private String categoryName;
    private BigDecimal limitAmount;
    private BudgetPeriod period;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static BudgetResponse fromEntity(Budget budget) {
        if (budget == null) {
            return null;
        }
        return BudgetResponse.builder()
                .budgetId(budget.getBudgetId())
                .userId(budget.getUserId())
                .categoryId(budget.getCategoryId())
                .categoryName(budget.getCategory() != null ? budget.getCategory().getCategoryName() : null)
                .limitAmount(budget.getLimitAmount())
                .period(budget.getPeriod())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .createdBy(budget.getCreatedBy())
                .updatedBy(budget.getUpdatedBy())
                .build();
    }
}
