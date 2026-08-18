package com.pbfm.repository;

import com.pbfm.entity.Transaction;
import com.pbfm.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Page<Transaction> findByUser_UserId(UUID userId, Pageable pageable);
    Page<Transaction> findByAccount_AccountId(UUID accountId, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId AND t.date BETWEEN :start AND :end")
    List<Transaction> findByDateRange(@Param("userId") UUID userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.userId = :userId AND t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal getTotalTransactionAmountByTypeInDateRange(@Param("userId") UUID userId, @Param("type") TransactionType type, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT t.category.categoryName, SUM(t.amount) FROM Transaction t WHERE t.user.userId = :userId AND t.type = 'EXPENSE' AND t.date BETWEEN :start AND :end GROUP BY t.category.categoryName")
    List<Object[]> getCategoryWiseSpendingSummary(@Param("userId") UUID userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.userId = :userId AND t.category.categoryId = :categoryId AND t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal getTotalAmountByCategoryIdAndTypeInDateRange(@Param("userId") UUID userId, @Param("categoryId") UUID categoryId, @Param("type") TransactionType type, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId " +
           "AND (:accountId IS NULL OR t.account.accountId = :accountId) " +
           "AND (:startDate IS NULL OR t.date >= :startDate) " +
           "AND (:endDate IS NULL OR t.date <= :endDate)")
    Page<Transaction> findFilteredTransactions(
        @Param("userId") UUID userId,
        @Param("accountId") UUID accountId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Transaction t SET t.category = null WHERE t.category.categoryId = :categoryId")
    void setCategoryToNullForCategoryId(@Param("categoryId") UUID categoryId);
}
