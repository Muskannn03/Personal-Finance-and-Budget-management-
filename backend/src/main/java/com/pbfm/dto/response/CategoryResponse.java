package com.pbfm.dto.response;

import com.pbfm.enums.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response model representing a category")
public class CategoryResponse {

    @Schema(description = "Unique identifier of the category", example = "a23e4567-e89b-12d3-a456-426614174111")
    private UUID categoryId;

    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @Schema(description = "Name of the category", example = "Shopping")
    private String categoryName;

    @Schema(description = "Type of transaction associated with the category", example = "EXPENSE")
    private TransactionType type;

    @Schema(description = "Timestamp when the category was created", example = "2026-08-14T10:40:11")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the category was last updated", example = "2026-08-14T10:40:11")
    private LocalDateTime updatedAt;
}
