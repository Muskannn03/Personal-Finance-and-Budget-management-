package com.pbfm.dto.response;

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
public class UserResponse {
    private UUID userId;
    private String name;
    private String email;
    private String currencyPreference;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
