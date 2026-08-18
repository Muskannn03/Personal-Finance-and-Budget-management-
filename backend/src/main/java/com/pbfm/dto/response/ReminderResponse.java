package com.pbfm.dto.response;

import com.pbfm.enums.ReminderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
