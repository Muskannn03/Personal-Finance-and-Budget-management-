package com.pbfm.entity;

import com.pbfm.enums.GoalStatus;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "goals")
@SQLDelete(sql = "UPDATE goals SET deleted_at = CURRENT_TIMESTAMP WHERE goal_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "investments"})
@EqualsAndHashCode(callSuper = true, exclude = {"user", "investments"})
public class Goal extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "goal_id", updatable = false, nullable = false)
    private UUID goalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Transient
    private UUID userId;

    public UUID getUserId() {
        return user != null ? user.getUserId() : userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    @Column(name = "goal_name", nullable = false, length = 100)
    private String goalName;

    @Column(name = "target_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "current_amount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "goal_status_enum")
    @Builder.Default
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    @Column(name = "deleted_at")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Investment> investments = new ArrayList<>();
}
