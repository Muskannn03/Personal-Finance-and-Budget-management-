package com.pbfm.dto.request;

import com.pbfm.enums.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request model to create a category")
public class CategoryCreateRequest {

    @NotNull(message = "User ID is required")
    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Schema(description = "Name of the category", example = "Shopping")
    private String categoryName;

    @NotNull(message = "Transaction type is required")
    @Schema(description = "Type of transaction associated with the category", example = "EXPENSE")
    private TransactionType type;
}
