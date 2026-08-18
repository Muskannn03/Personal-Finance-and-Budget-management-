package com.pbfm.mapper;

import com.pbfm.dto.request.UserCreateRequest;
import com.pbfm.dto.request.UserUpdateRequest;
import com.pbfm.dto.response.UserResponse;
import com.pbfm.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "accounts", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "goals", ignore = true)
    @Mapping(target = "investments", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "reminders", ignore = true)
    @Mapping(target = "riskProfile", ignore = true)
    User toEntity(UserCreateRequest request);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "accounts", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "goals", ignore = true)
    @Mapping(target = "investments", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "reminders", ignore = true)
    @Mapping(target = "riskProfile", ignore = true)
    void updateEntityFromRequest(UserUpdateRequest request, @MappingTarget User user);

    UserResponse toResponse(User user);

    void updateEntityFromDto(UserUpdateRequest request, @org.mapstruct.MappingTarget User entity);
}

