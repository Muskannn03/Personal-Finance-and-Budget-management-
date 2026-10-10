package com.pbfm.entity;

import com.pbfm.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@SQLDelete(sql = "UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE transaction_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "account", "category", "rewards"})
@EqualsAndHashCode(callSuper = true, exclude = {"user", "account", "category", "rewards"})
public class Transaction extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "transaction_id", updatable = false, nullable = false)
    private UUID transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Category category;

    @Transient
    private UUID userId;

    @Transient
    private UUID accountId;

    @Transient
    private UUID categoryId;

    public UUID getUserId() {
        return user != null ? user.getUserId() : userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getAccountId() {
        return account != null ? account.getAccountId() : accountId;
    }

    public void setAccountId(UUID accountId) {
        this.accountId = accountId;
    }

    public UUID getCategoryId() {
        return category != null ? category.getCategoryId() : categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    @Transient
    private String description;

    @Transient
    private String accountName;

    @Transient
    private String categoryName;

    public String getDescription() {
        if (description != null && !description.trim().isEmpty()) {
            return description;
        }
        if (category != null && category.getCategoryName() != null) {
            return category.getCategoryName();
        }
        return type == TransactionType.INCOME ? "Income Deposit" : "Expense Payment";
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAccountName() {
        if (account != null) {
            return account.getAccountName();
        }
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCategoryName() {
        if (category != null) {
            return category.getCategoryName();
        }
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("category")
    public java.util.Map<String, Object> getCategorySummary() {
        if (category != null) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("categoryId", category.getCategoryId());
            map.put("categoryName", category.getCategoryName());
            map.put("type", category.getType() != null ? category.getType().name() : null);
            return map;
        }
        if (categoryName != null) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("categoryId", categoryId);
            map.put("categoryName", categoryName);
            return map;
        }
        return null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("account")
    public java.util.Map<String, Object> getAccountSummary() {
        if (account != null) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("accountId", account.getAccountId());
            map.put("accountName", account.getAccountName());
            map.put("accountType", account.getAccountType() != null ? account.getAccountType().name() : null);
            return map;
        }
        if (accountName != null) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("accountId", accountId);
            map.put("accountName", accountName);
            return map;
        }
        return null;
    }

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "transaction_type_enum")
    private TransactionType type;

    @Column(name = "date", nullable = false)
    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();

    @Column(name = "deleted_at")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "sourceTransaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Reward> rewards = new ArrayList<>();
}
