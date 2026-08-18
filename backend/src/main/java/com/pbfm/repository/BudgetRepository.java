package com.pbfm.repository;

import com.pbfm.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUser_UserId(UUID userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.userId = :userId AND b.category.categoryId = :categoryId AND :date BETWEEN b.startDate AND b.endDate")
    Optional<Budget> findActiveBudget(@Param("userId") UUID userId, @Param("categoryId") UUID categoryId, @Param("date") LocalDate date);
}
