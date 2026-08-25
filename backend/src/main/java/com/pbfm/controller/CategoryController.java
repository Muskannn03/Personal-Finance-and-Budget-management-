package com.pbfm.controller;

import com.pbfm.entity.Category;
import com.pbfm.entity.User;
import com.pbfm.exception.DuplicateResourceException;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.CategoryRepository;
import com.pbfm.repository.TransactionRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Endpoints for managing transaction categories")
@Slf4j
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody Category request) {
        log.info("Creating category '{}' of type {} for user ID: {}", request.getCategoryName(), request.getType(), request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (categoryRepository.existsByUser_UserIdAndCategoryNameAndType(request.getUserId(), request.getCategoryName(), request.getType())) {
            throw new DuplicateResourceException("Category already exists for user: " + request.getCategoryName());
        }

        request.setUser(user);
        Category savedCategory = categoryRepository.save(request);

        log.info("Category created successfully with ID: {}", savedCategory.getCategoryId());
        return new ResponseEntity<>(
                ApiResponse.success(savedCategory, "Category created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable UUID id) {
        log.info("Fetching category by ID: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody Category request) {
        log.info("Updating category with ID: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getCategoryName().equalsIgnoreCase(request.getCategoryName()) || category.getType() != request.getType()) {
            if (categoryRepository.existsByUser_UserIdAndCategoryNameAndType(category.getUser().getUserId(), request.getCategoryName(), request.getType())) {
                throw new DuplicateResourceException("Category already exists for user: " + request.getCategoryName());
            }
        }

        category.setCategoryName(request.getCategoryName());
        category.setType(request.getType());
        Category updatedCategory = categoryRepository.save(category);

        log.info("Category with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category (soft delete)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        log.info("Deleting category with ID: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Business Rule: Nullify category references on associated transactions first
        log.info("Nullifying category references on transactions associated with category ID: {}", id);
        transactionRepository.setCategoryToNullForCategoryId(id);
        
        categoryRepository.delete(category);
        log.info("Category with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all categories for a specific user")
    public ResponseEntity<ApiResponse<List<Category>>> getCategoriesByUserId(@PathVariable UUID userId) {
        log.info("Fetching all categories for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Category> categories = categoryRepository.findByUser_UserId(userId);
        log.info("Found {} categories for user ID: {}", categories.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
