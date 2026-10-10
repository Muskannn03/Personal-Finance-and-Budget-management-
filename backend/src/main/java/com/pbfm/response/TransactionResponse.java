package com.pbfm.response;

import com.pbfm.entity.Transaction;
import com.pbfm.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private UUID transactionId;
    private UUID userId;
    private UUID accountId;
    private String accountName;
    private UUID categoryId;
    private String categoryName;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDateTime date;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static TransactionResponse fromEntity(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        return TransactionResponse.builder()
                .transactionId(transaction.getTransactionId())
                .userId(transaction.getUserId())
                .accountId(transaction.getAccountId())
                .accountName(transaction.getAccount() != null ? transaction.getAccount().getAccountName() : null)
                .categoryId(transaction.getCategoryId())
                .categoryName(transaction.getCategory() != null ? transaction.getCategory().getCategoryName() : null)
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .date(transaction.getDate())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .createdBy(transaction.getCreatedBy())
                .updatedBy(transaction.getUpdatedBy())
                .build();
    }
}
