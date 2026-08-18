package com.pbfm.dto.request;

import com.pbfm.enums.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request model to update an existing transaction")
public class TransactionUpdateRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Schema(description = "Amount of the transaction", example = "600.00")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    @Schema(description = "Type of transaction", example = "EXPENSE")
    private TransactionType type;

    @NotNull(message = "Transaction date is required")
    @Schema(description = "Date and time of the transaction", example = "2026-08-14T10:40:11")
    private LocalDateTime date;

    @Schema(description = "Unique identifier of the category (optional)", example = "a23e4567-e89b-12d3-a456-426614174111")
    private UUID categoryId;
}
