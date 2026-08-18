package com.pbfm.mapper;

import com.pbfm.dto.request.ReminderCreateRequest;
import com.pbfm.dto.request.ReminderUpdateRequest;
import com.pbfm.dto.response.ReminderResponse;
import com.pbfm.entity.Reminder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface ReminderMapper {

    @Mapping(target = "reminderId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Reminder toEntity(ReminderCreateRequest request);

    @Mapping(target = "reminderId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "relatedType", ignore = true)
    @Mapping(target = "relatedId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(ReminderUpdateRequest request, @MappingTarget Reminder reminder);

    @Mapping(source = "user.userId", target = "userId")
    ReminderResponse toResponse(Reminder reminder);

    List<ReminderResponse> toResponseList(List<Reminder> reminders);

    void updateEntityFromDto(ReminderUpdateRequest request, @org.mapstruct.MappingTarget Reminder entity);
}

