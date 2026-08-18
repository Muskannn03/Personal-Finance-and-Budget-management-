package com.pbfm.controller;

import com.pbfm.dto.request.ReminderCreateRequest;
import com.pbfm.dto.request.ReminderUpdateRequest;
import com.pbfm.dto.response.ReminderResponse;
import com.pbfm.entity.Reminder;
import com.pbfm.entity.User;
import com.pbfm.enums.ReminderStatus;
import com.pbfm.exception.ResourceNotFoundException;
import com.pbfm.mapper.ReminderMapper;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reminders")
@RequiredArgsConstructor
@Tag(name = "Reminder Management", description = "Endpoints for scheduling due dates and warning notifications")
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final InvestmentRepository investmentRepository;
    private final ReminderMapper reminderMapper;

    @PostMapping
    @Operation(summary = "Schedule a new reminder")
    public ResponseEntity<ApiResponse<ReminderResponse>> createReminder(@Valid @RequestBody ReminderCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Validate that the polymorphic related_id actually exists
        validatePolymorphicReference(request.getRelatedType(), request.getRelatedId());

        Reminder reminder = reminderMapper.toEntity(request);
        reminder.setUser(user);
        Reminder savedReminder = reminderRepository.save(reminder);

        return new ResponseEntity<>(
                ApiResponse.success(reminderMapper.toResponse(savedReminder), "Reminder created successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reminder by ID")
    public ResponseEntity<ApiResponse<ReminderResponse>> getReminderById(@PathVariable UUID id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success(reminderMapper.toResponse(reminder)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing reminder")
    public ResponseEntity<ApiResponse<ReminderResponse>> updateReminder(
            @PathVariable UUID id,
            @Valid @RequestBody ReminderUpdateRequest request) {

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminderMapper.updateEntityFromDto(request, reminder);
        Reminder updatedReminder = reminderRepository.save(reminder);

        return ResponseEntity.ok(ApiResponse.success(reminderMapper.toResponse(updatedReminder), "Reminder updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reminder (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(@PathVariable UUID id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminderRepository.delete(reminder);
        return ResponseEntity.ok(ApiResponse.success(null, "Reminder deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all reminders for a specific user")
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getRemindersByUserId(@PathVariable UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        List<Reminder> reminders = reminderRepository.findByUser_UserId(userId);
        List<ReminderResponse> responses = reminders.stream()
                .map(reminderMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}/details")
    @Operation(summary = "Get full object details of the polymorphic linked entity")
    public ResponseEntity<ApiResponse<Object>> getReminderPolymorphicDetails(@PathVariable UUID id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        Object detailedEntity = loadPolymorphicReference(reminder.getRelatedType(), reminder.getRelatedId());
        return ResponseEntity.ok(ApiResponse.success(detailedEntity));
    }

    @GetMapping("/due")
    @Operation(summary = "Get all due reminders currently pending")
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getDueReminders() {
        List<Reminder> dueReminders = reminderRepository.findByDueDateBeforeAndStatus(
                LocalDateTime.now(), ReminderStatus.PENDING);
        List<ReminderResponse> responses = dueReminders.stream()
                .map(reminderMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    private void validatePolymorphicReference(String type, UUID id) {
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
