package com.pbfm.entity;

import com.pbfm.enums.ReminderStatus;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reminders")
@SQLDelete(sql = "UPDATE reminders SET deleted_at = CURRENT_TIMESTAMP WHERE reminder_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(callSuper = true, exclude = {"user"})
public class Reminder extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "reminder_id", updatable = false, nullable = false)
    private UUID reminderId;

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

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "related_type", nullable = false, length = 30)
    private String relatedType;

    @Column(name = "related_id", nullable = false)
    private UUID relatedId;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "reminder_status_enum")
    @Builder.Default
    private ReminderStatus status = ReminderStatus.PENDING;

    @Column(name = "deleted_at")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime deletedAt;
}
