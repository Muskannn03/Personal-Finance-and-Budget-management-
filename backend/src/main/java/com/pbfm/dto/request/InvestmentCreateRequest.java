package com.pbfm.dto.request;

import com.pbfm.enums.InvestmentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentCreateRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    private UUID goalId;

    @NotNull(message = "Investment type is required")
    private InvestmentType type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate maturityDate;

    @NotNull(message = "Current value is required")
    @PositiveOrZero(message = "Current value must be zero or positive")
    private BigDecimal currentValue;
}
