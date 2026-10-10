package com.pbfm.response;

import com.pbfm.entity.Reminder;
import com.pbfm.enums.ReminderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderResponse {

    private UUID reminderId;
    private UUID userId;
    private String title;
    private String relatedType;
    private UUID relatedId;
    private LocalDateTime dueDate;
    private ReminderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public static ReminderResponse fromEntity(Reminder reminder) {
        if (reminder == null) {
            return null;
        }
        return ReminderResponse.builder()
                .reminderId(reminder.getReminderId())
                .userId(reminder.getUserId())
                .title(reminder.getTitle())
                .relatedType(reminder.getRelatedType())
                .relatedId(reminder.getRelatedId())
                .dueDate(reminder.getDueDate())
                .status(reminder.getStatus())
                .createdAt(reminder.getCreatedAt())
                .updatedAt(reminder.getUpdatedAt())
                .createdBy(reminder.getCreatedBy())
                .updatedBy(reminder.getUpdatedBy())
                .build();
    }
}
