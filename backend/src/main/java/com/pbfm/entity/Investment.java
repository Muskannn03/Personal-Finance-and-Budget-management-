package com.pbfm.entity;

import com.pbfm.enums.InvestmentType;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investments")
@SQLDelete(sql = "UPDATE investments SET deleted_at = CURRENT_TIMESTAMP WHERE investment_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "goal"})
@EqualsAndHashCode(callSuper = true, exclude = {"user", "goal"})
public class Investment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "investment_id", updatable = false, nullable = false)
    private UUID investmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Goal goal;

    @Transient
    private UUID userId;

    @Transient
    private UUID goalId;

    public UUID getUserId() {
        return user != null ? user.getUserId() : userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getGoalId() {
        return goal != null ? goal.getGoalId() : goalId;
    }

    public void setGoalId(UUID goalId) {
        this.goalId = goalId;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "investment_type_enum")
    private InvestmentType type;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "current_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "deleted_at")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime deletedAt;
}
