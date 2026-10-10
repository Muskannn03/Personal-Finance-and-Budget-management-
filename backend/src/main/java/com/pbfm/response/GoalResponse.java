package com.pbfm.response;

import com.pbfm.entity.Goal;
import com.pbfm.enums.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalResponse {

    private UUID goalId;
    private UUID userId;
    private String goalName;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private LocalDate targetDate;
    private GoalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static GoalResponse fromEntity(Goal goal) {
        if (goal == null) {
            return null;
        }
        return GoalResponse.builder()
                .goalId(goal.getGoalId())
                .userId(goal.getUserId())
                .goalName(goal.getGoalName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus())
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .createdBy(goal.getCreatedBy())
                .updatedBy(goal.getUpdatedBy())
                .build();
    }
}
