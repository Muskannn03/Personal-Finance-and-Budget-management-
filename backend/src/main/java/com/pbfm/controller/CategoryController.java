package com.pbfm.controller;

import com.pbfm.dto.request.CategoryCreateRequest;
import com.pbfm.dto.request.CategoryUpdateRequest;
import com.pbfm.dto.response.CategoryResponse;
import com.pbfm.entity.Category;
import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.CategoryMapper;
import com.pbfm.repository.CategoryRepository;
import com.pbfm.repository.TransactionRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Endpoints for managing transaction categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryMapper categoryMapper;

    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (categoryRepository.existsByUser_UserIdAndCategoryNameAndType(request.getUserId(), request.getCategoryName(), request.getType())) {
            throw new DuplicateResourceException("Category already exists for user: " + request.getCategoryName());
        }

        Category category = categoryMapper.toEntity(request);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return new ResponseEntity<>(
                ApiResponse.success(categoryMapper.toResponse(savedCategory), "Category created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(categoryMapper.toResponse(category)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryUpdateRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getCategoryName().equalsIgnoreCase(request.getCategoryName()) || category.getType() != request.getType()) {
            if (categoryRepository.existsByUser_UserIdAndCategoryNameAndType(category.getUser().getUserId(), request.getCategoryName(), request.getType())) {
                throw new DuplicateResourceException("Category already exists for user: " + request.getCategoryName());
            }
        }

        categoryMapper.updateEntityFromDto(request, category);
        Category updatedCategory = categoryRepository.save(category);

        return ResponseEntity.ok(ApiResponse.success(categoryMapper.toResponse(updatedCategory), "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category (soft delete)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Business Rule: Nullify category references on associated transactions first
        transactionRepository.setCategoryToNullForCategoryId(id);
        
        categoryRepository.delete(category);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all categories for a specific user")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoriesByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Category> categories = categoryRepository.findByUser_UserId(userId);
        List<CategoryResponse> responses = categories.stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
