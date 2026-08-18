package com.pbfm.mapper;

import com.pbfm.dto.request.GoalCreateRequest;
import com.pbfm.dto.request.GoalUpdateRequest;
import com.pbfm.dto.response.GoalResponse;
import com.pbfm.entity.Goal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface GoalMapper {

    @Mapping(target = "goalId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "currentAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "investments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Goal toEntity(GoalCreateRequest request);

    @Mapping(target = "goalId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "currentAmount", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "investments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromRequest(GoalUpdateRequest request, @MappingTarget Goal goal);

    @Mapping(target = "userId", source = "user.userId")
    GoalResponse toResponse(Goal goal);

    void updateEntityFromDto(GoalUpdateRequest request, @org.mapstruct.MappingTarget Goal entity);
}

