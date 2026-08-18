package com.pbfm.repository;

import com.pbfm.entity.Reminder;
import com.pbfm.enums.ReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {
    List<Reminder> findByUser_UserId(UUID userId);
    
    @Query("SELECT r FROM Reminder r WHERE r.dueDate <= :now AND r.status = :status")
    List<Reminder> findByDueDateBeforeAndStatus(@Param("now") LocalDateTime now, @Param("status") ReminderStatus status);
}
