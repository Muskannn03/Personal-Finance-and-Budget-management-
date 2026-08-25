package com.pbfm.entity;

import com.pbfm.enums.RewardStatus;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rewards")
@SQLDelete(sql = "UPDATE rewards SET deleted_at = CURRENT_TIMESTAMP WHERE reward_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "account", "sourceTransaction"})
@EqualsAndHashCode(callSuper = true, exclude = {"user", "account", "sourceTransaction"})
public class Reward extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "reward_id", updatable = false, nullable = false)
    private UUID rewardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_transaction_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Transaction sourceTransaction;

    @Transient
    private UUID userId;

    @Transient
    private UUID accountId;

    @Transient
    private UUID sourceTransactionId;

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

    public UUID getSourceTransactionId() {
        return sourceTransaction != null ? sourceTransaction.getTransactionId() : sourceTransactionId;
    }

    public void setSourceTransactionId(UUID sourceTransactionId) {
        this.sourceTransactionId = sourceTransactionId;
    }

    @Column(name = "reward_type", nullable = false, length = 50)
    private String rewardType;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "reward_status_enum")
    @Builder.Default
    private RewardStatus status = RewardStatus.EARNED;

    @Column(name = "earned_date", nullable = false)
    @Builder.Default
    private LocalDate earnedDate = LocalDate.now();

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "redeemed_date")
    private LocalDate redeemedDate;

    @Column(name = "deleted_at")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime deletedAt;
}
