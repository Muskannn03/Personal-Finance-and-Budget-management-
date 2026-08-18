package com.pbfm.repository;

import com.pbfm.entity.Category;
import com.pbfm.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUser_UserId(UUID userId);
    Optional<Category> findByUser_UserIdAndCategoryNameAndType(UUID userId, String categoryName, TransactionType type);
    boolean existsByUser_UserIdAndCategoryNameAndType(UUID userId, String categoryName, TransactionType type);
}
