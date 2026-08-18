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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request model to update a category")
public class CategoryUpdateRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Schema(description = "Name of the category", example = "Shopping")
    private String categoryName;

    @NotNull(message = "Transaction type is required")
    @Schema(description = "Type of transaction associated with the category", example = "EXPENSE")
    private TransactionType type;
}
