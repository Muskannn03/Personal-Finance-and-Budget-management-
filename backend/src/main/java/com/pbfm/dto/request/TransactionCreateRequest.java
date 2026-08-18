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
@Schema(description = "Request model to create a transaction")
public class TransactionCreateRequest {

    @NotNull(message = "User ID is required")
    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @NotNull(message = "Account ID is required")
    @Schema(description = "Unique identifier of the account", example = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d")
    private UUID accountId;

    @Schema(description = "Unique identifier of the category (optional)", example = "a23e4567-e89b-12d3-a456-426614174111")
    private UUID categoryId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Schema(description = "Amount of the transaction", example = "550.00")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    @Schema(description = "Type of transaction", example = "EXPENSE")
    private TransactionType type;

    @NotNull(message = "Transaction date is required")
    @Schema(description = "Date and time of the transaction", example = "2026-08-14T10:40:11")
    private LocalDateTime date;
}
