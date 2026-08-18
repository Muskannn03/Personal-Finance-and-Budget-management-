package com.pbfm.mapper;

import com.pbfm.dto.request.ReminderCreateRequest;
import com.pbfm.dto.request.ReminderUpdateRequest;
import com.pbfm.dto.response.ReminderResponse;
import com.pbfm.entity.Reminder;
import com.pbfm.entity.User;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-14T11:15:22+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ReminderMapperImpl implements ReminderMapper {

    @Override
    public Reminder toEntity(ReminderCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Reminder reminder = new Reminder();

        reminder.setDueDate( request.getDueDate() );
        reminder.setRelatedId( request.getRelatedId() );
        reminder.setRelatedType( request.getRelatedType() );
        reminder.setTitle( request.getTitle() );

        return reminder;
    }

    @Override
    public void updateEntityFromRequest(ReminderUpdateRequest request, Reminder reminder) {
        if ( request == null ) {
            return;
        }

        reminder.setDueDate( request.getDueDate() );
        reminder.setStatus( request.getStatus() );
        reminder.setTitle( request.getTitle() );
    }

    @Override
    public ReminderResponse toResponse(Reminder reminder) {
        if ( reminder == null ) {
            return null;
        }

        ReminderResponse reminderResponse = new ReminderResponse();

        reminderResponse.setUserId( reminderUserUserId( reminder ) );
        reminderResponse.setCreatedAt( reminder.getCreatedAt() );
        reminderResponse.setDueDate( reminder.getDueDate() );
        reminderResponse.setRelatedId( reminder.getRelatedId() );
        reminderResponse.setRelatedType( reminder.getRelatedType() );
        reminderResponse.setReminderId( reminder.getReminderId() );
        reminderResponse.setStatus( reminder.getStatus() );
        reminderResponse.setTitle( reminder.getTitle() );
        reminderResponse.setUpdatedAt( reminder.getUpdatedAt() );

        return reminderResponse;
    }

    @Override
    public List<ReminderResponse> toResponseList(List<Reminder> reminders) {
        if ( reminders == null ) {
            return null;
        }

        List<ReminderResponse> list = new ArrayList<ReminderResponse>( reminders.size() );
        for ( Reminder reminder : reminders ) {
            list.add( toResponse( reminder ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromDto(ReminderUpdateRequest request, Reminder entity) {
        if ( request == null ) {
            return;
        }

        entity.setDueDate( request.getDueDate() );
        entity.setStatus( request.getStatus() );
        entity.setTitle( request.getTitle() );
    }

    private UUID reminderUserUserId(Reminder reminder) {
        if ( reminder == null ) {
            return null;
        }
        User user = reminder.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }
}
