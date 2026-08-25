package com.pbfm.controller;

import com.pbfm.entity.Reminder;
import com.pbfm.entity.User;
import com.pbfm.enums.ReminderStatus;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.repository.BudgetRepository;
import com.pbfm.repository.GoalRepository;
import com.pbfm.repository.InvestmentRepository;
import com.pbfm.repository.ReminderRepository;
import com.pbfm.repository.UserRepository;
import com.pbfm.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reminders")
@RequiredArgsConstructor
@Tag(name = "Reminder Management", description = "Endpoints for scheduling due dates and warning notifications")
@Slf4j
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final InvestmentRepository investmentRepository;

    @PostMapping
    @Operation(summary = "Schedule a new reminder")
    public ResponseEntity<ApiResponse<Reminder>> createReminder(@Valid @RequestBody Reminder request) {
        log.info("Scheduling a new reminder '{}' for user ID: {}, related to: {}", request.getTitle(), request.getUserId(), request.getRelatedType());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Validate that the polymorphic related_id actually exists
        if (request.getRelatedType() != null && request.getRelatedId() != null) {
            validatePolymorphicReference(request.getRelatedType(), request.getRelatedId());
        }

        request.setUser(user);
        Reminder savedReminder = reminderRepository.save(request);

        log.info("Reminder scheduled successfully with ID: {}", savedReminder.getReminderId());
        return new ResponseEntity<>(
                ApiResponse.success(savedReminder, "Reminder created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reminder by ID")
    public ResponseEntity<ApiResponse<Reminder>> getReminderById(@PathVariable UUID id) {
        log.info("Fetching reminder by ID: {}", id);
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(reminder));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing reminder")
    public ResponseEntity<ApiResponse<Reminder>> updateReminder(
            @PathVariable UUID id,
            @Valid @RequestBody Reminder request) {
        log.info("Updating reminder with ID: {}", id);
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminder.setTitle(request.getTitle());
        reminder.setRelatedType(request.getRelatedType());
        reminder.setRelatedId(request.getRelatedId());
        reminder.setDueDate(request.getDueDate());
        reminder.setStatus(request.getStatus());
        Reminder updatedReminder = reminderRepository.save(reminder);

        log.info("Reminder with ID: {} updated successfully", id);
        return ResponseEntity.ok(ApiResponse.success(updatedReminder, "Reminder updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reminder (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(@PathVariable UUID id) {
        log.info("Deleting reminder with ID: {}", id);
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminderRepository.delete(reminder);
        log.info("Reminder with ID: {} deleted successfully", id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reminder deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all reminders for a specific user")
    public ResponseEntity<ApiResponse<List<Reminder>>> getRemindersByUserId(@PathVariable UUID userId) {
        log.info("Fetching all reminders for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Reminder> reminders = reminderRepository.findByUser_UserId(userId);
        log.info("Found {} reminders for user ID: {}", reminders.size(), userId);
        return ResponseEntity.ok(ApiResponse.success(reminders));
    }

    @GetMapping("/{id}/details")
    @Operation(summary = "Get full object details of the polymorphic linked entity")
    public ResponseEntity<ApiResponse<Object>> getReminderPolymorphicDetails(@PathVariable UUID id) {
        log.info("Fetching detailed object for reminder ID: {}", id);
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        Object detailedEntity = loadPolymorphicReference(reminder.getRelatedType(), reminder.getRelatedId());
        return ResponseEntity.ok(ApiResponse.success(detailedEntity));
    }

    @GetMapping("/due")
    @Operation(summary = "Get all due reminders currently pending")
    public ResponseEntity<ApiResponse<List<Reminder>>> getDueReminders() {
        log.info("Fetching all pending due reminders");
        List<Reminder> dueReminders = reminderRepository.findByDueDateBeforeAndStatus(
                LocalDateTime.now(), ReminderStatus.PENDING);
        log.info("Found {} pending due reminders", dueReminders.size());
        return ResponseEntity.ok(ApiResponse.success(dueReminders));
    }

    private void validatePolymorphicReference(String type, UUID id) {
        log.debug("Validating polymorphic reference of type: {} with ID: {}", type, id);
        switch (type.toUpperCase()) {
            case "BUDGET":
                if (!budgetRepository.existsById(id)) {
                    throw new ResourceNotFoundException("Linked Budget not found with id: " + id);
                }
                break;
            case "GOAL":
                if (!goalRepository.existsById(id)) {
                    throw new ResourceNotFoundException("Linked Goal not found with id: " + id);
                }
                break;
            case "INVESTMENT":
                if (!investmentRepository.existsById(id)) {
                    throw new ResourceNotFoundException("Linked Investment not found with id: " + id);
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid relatedType: " + type + ". Must be BUDGET, GOAL or INVESTMENT.");
        }
    }

    private Object loadPolymorphicReference(String type, UUID id) {
        log.debug("Loading polymorphic reference of type: {} with ID: {}", type, id);
        switch (type.toUpperCase()) {
            case "BUDGET":
                return budgetRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Linked Budget not found with id: " + id));
            case "GOAL":
                return goalRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Linked Goal not found with id: " + id));
            case "INVESTMENT":
                return investmentRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Linked Investment not found with id: " + id));
            default:
                throw new IllegalArgumentException("Invalid relatedType: " + type);
        }
    }
}
