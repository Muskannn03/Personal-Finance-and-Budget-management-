package com.pbfm.dto.response;

import com.pbfm.enums.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Response model representing a transaction")
public class TransactionResponse {

    @Schema(description = "Unique identifier of the transaction", example = "b12e4567-e89b-12d3-a456-426614174222")
    private UUID transactionId;

    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @Schema(description = "Unique identifier of the account associated with the transaction", example = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d")
    private UUID accountId;

    @Schema(description = "Unique identifier of the category associated with the transaction", example = "a23e4567-e89b-12d3-a456-426614174111")
    private UUID categoryId;

    @Schema(description = "Amount of the transaction", example = "550.00")
    private BigDecimal amount;

    @Schema(description = "Type of transaction", example = "EXPENSE")
    private TransactionType type;

    @Schema(description = "Date and time of the transaction", example = "2026-08-14T10:40:11")
    private LocalDateTime date;

    @Schema(description = "Timestamp when the transaction was created", example = "2026-08-14T10:40:11")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the transaction was last updated", example = "2026-08-14T10:40:11")
    private LocalDateTime updatedAt;
}
