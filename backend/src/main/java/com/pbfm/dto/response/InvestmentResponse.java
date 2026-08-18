package com.pbfm.dto.response;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentResponse {
    private UUID investmentId;
    private UUID userId;
    private UUID goalId;
    private InvestmentType type;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private BigDecimal currentValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
