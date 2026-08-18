package com.pbfm.controller;

import com.pbfm.entity.Account;
import com.pbfm.entity.Budget;
import com.pbfm.entity.Goal;
import com.pbfm.enums.TransactionType;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.*;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reporting & Analytics", description = "Endpoints for generating financial reports dynamically using SQL/JPQL queries")
public class ReportController {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final InvestmentRepository investmentRepository;
    private final RewardRepository rewardRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated dashboard analytics for a user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardAnalytics(@RequestParam UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Map<String, Object> analytics = new HashMap<>();

        // Net Worth
        BigDecimal netWorth = accountRepository.getNetWorthByUserId(userId);
        analytics.put("netWorth", netWorth);

        // Monthly Income and Expense
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(LocalTime.MAX);
        
        BigDecimal monthlyIncome = transactionRepository.getTotalTransactionAmountByTypeInDateRange(
                userId, TransactionType.INCOME, monthStart, monthEnd);
        BigDecimal monthlyExpense = transactionRepository.getTotalTransactionAmountByTypeInDateRange(
                userId, TransactionType.EXPENSE, monthStart, monthEnd);

        analytics.put("monthlyIncome", monthlyIncome);
        analytics.put("monthlyExpense", monthlyExpense);

        // Account Summaries
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<Map<String, Object>> accountSummaryList = new ArrayList<>();
        for (Account acc : accounts) {
            Map<String, Object> summary = new HashMap<>();
            summary.put("accountId", acc.getAccountId());
            summary.put("accountName", acc.getAccountName());
            summary.put("accountType", acc.getAccountType());
            summary.put("balance", acc.getBalance());
            accountSummaryList.add(summary);
        }
        analytics.put("accounts", accountSummaryList);

        // Goal Progress Summary
        List<Goal> goals = goalRepository.findByUser_UserId(userId);
        List<Map<String, Object>> goalSummaryList = new ArrayList<>();
        for (Goal goal : goals) {
            Map<String, Object> summary = new HashMap<>();
            summary.put("goalId", goal.getGoalId());
            summary.put("goalName", goal.getGoalName());
            summary.put("targetAmount", goal.getTargetAmount());
            summary.put("currentAmount", goal.getCurrentAmount());
            summary.put("status", goal.getStatus());
            summary.put("targetDate", goal.getTargetDate());
            goalSummaryList.add(summary);
        }
        analytics.put("goals", goalSummaryList);

        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/spending")
    @Operation(summary = "Get category-wise spending report in a date range")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategorySpendingReport(
            @RequestParam UUID userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);

        List<Object[]> rawSummary = transactionRepository.getCategoryWiseSpendingSummary(userId, start, end);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Object[] row : rawSummary) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoryName", row[0]);
            item.put("amountSpent", row[1]);
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/budget-utilization")
    @Operation(summary = "Get budget utilization report for a user's active budgets")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBudgetUtilizationReport(@RequestParam UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Budget> budgets = budgetRepository.findByUser_UserId(userId);
        List<Map<String, Object>> report = new ArrayList<>();

        for (Budget budget : budgets) {
            LocalDateTime start = budget.getStartDate().atStartOfDay();
            LocalDateTime end = budget.getEndDate().atTime(23, 59, 59);

            BigDecimal currentTotal = transactionRepository.getTotalAmountByCategoryIdAndTypeInDateRange(
                    userId, budget.getCategory().getCategoryId(), TransactionType.EXPENSE, start, end);

            BigDecimal utilizationPct = BigDecimal.ZERO;
            if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0) {
                utilizationPct = currentTotal.multiply(new BigDecimal("100"))
                        .divide(budget.getLimitAmount(), 2, BigDecimal.ROUND_HALF_UP);
            }

            Map<String, Object> item = new HashMap<>();
            item.put("budgetId", budget.getBudgetId());
            item.put("categoryName", budget.getCategory().getCategoryName());
            item.put("limitAmount", budget.getLimitAmount());
            item.put("actualSpent", currentTotal);
            item.put("utilizationPercentage", utilizationPct);
            item.put("period", budget.getPeriod());
            item.put("startDate", budget.getStartDate());
            item.put("endDate", budget.getEndDate());
            report.add(item);
        }

        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/monthly-trend")
    @Operation(summary = "Get monthly income vs expense trends")
    @SuppressWarnings("unchecked")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlyIncomeExpenseTrends(@RequestParam UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        // Run direct JPQL to group by month name and type
        String jpql = "SELECT TO_CHAR(t.date, 'YYYY-MM') as month, t.type, SUM(t.amount) " +
                      "FROM Transaction t WHERE t.user.userId = :userId " +
                      "GROUP BY TO_CHAR(t.date, 'YYYY-MM'), t.type " +
                      "ORDER BY month DESC";

        List<Object[]> rawData = entityManager.createQuery(jpql)
                .setParameter("userId", userId)
                .setMaxResults(24) // limit to past 2 years of trends
                .getResultList();

        Map<String, Map<String, BigDecimal>> monthMap = new TreeMap<>(Collections.reverseOrder());
        for (Object[] row : rawData) {
            String month = (String) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal sum = (BigDecimal) row[2];

            monthMap.computeIfAbsent(month, k -> new HashMap<>());
            monthMap.get(month).put(type.name(), sum);
        }

        List<Map<String, Object>> trendList = new ArrayList<>();
        for (Map.Entry<String, Map<String, BigDecimal>> entry : monthMap.entrySet()) {
            Map<String, Object> trendItem = new HashMap<>();
            trendItem.put("month", entry.getKey());
            trendItem.put("income", entry.getValue().getOrDefault("INCOME", BigDecimal.ZERO));
            trendItem.put("expense", entry.getValue().getOrDefault("EXPENSE", BigDecimal.ZERO));
            trendList.add(trendItem);
        }

        return ResponseEntity.ok(ApiResponse.success(trendList));
    }

    @GetMapping("/rewards-summary")
    @Operation(summary = "Get summary of reward statistics")
    @SuppressWarnings("unchecked")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRewardsSummary(@RequestParam UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        String jpql = "SELECT r.status, COUNT(r), SUM(r.amount) FROM Reward r " +
                      "WHERE r.user.userId = :userId GROUP BY r.status";

        List<Object[]> rawData = entityManager.createQuery(jpql)
                .setParameter("userId", userId)
                .getResultList();

        Map<String, Object> summary = new HashMap<>();
        BigDecimal totalEarnedAmount = BigDecimal.ZERO;
        long totalCount = 0;

        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Object[] row : rawData) {
            Map<String, Object> item = new HashMap<>();
            item.put("status", row[0]);
            item.put("count", row[1]);
            item.put("amount", row[2]);
            breakdown.add(item);

            totalCount += (Long) row[1];
            totalEarnedAmount = totalEarnedAmount.add((BigDecimal) row[2]);
        }

        summary.put("totalCount", totalCount);
        summary.put("totalEarnedAmount", totalEarnedAmount);
        summary.put("breakdown", breakdown);

        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
