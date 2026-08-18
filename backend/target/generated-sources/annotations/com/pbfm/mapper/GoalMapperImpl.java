package com.pbfm.mapper;

import com.pbfm.dto.request.GoalCreateRequest;
import com.pbfm.dto.request.GoalUpdateRequest;
import com.pbfm.dto.response.GoalResponse;
import com.pbfm.entity.Goal;
import com.pbfm.entity.User;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-14T11:15:22+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class GoalMapperImpl implements GoalMapper {

    @Override
    public Goal toEntity(GoalCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Goal goal = new Goal();

        goal.setGoalName( request.getGoalName() );
        goal.setTargetAmount( request.getTargetAmount() );
        goal.setTargetDate( request.getTargetDate() );

        return goal;
    }

    @Override
    public void updateEntityFromRequest(GoalUpdateRequest request, Goal goal) {
        if ( request == null ) {
            return;
        }

        goal.setGoalName( request.getGoalName() );
        goal.setStatus( request.getStatus() );
        goal.setTargetAmount( request.getTargetAmount() );
        goal.setTargetDate( request.getTargetDate() );
    }

    @Override
    public GoalResponse toResponse(Goal goal) {
        if ( goal == null ) {
            return null;
        }

        GoalResponse goalResponse = new GoalResponse();

        goalResponse.setUserId( goalUserUserId( goal ) );
        goalResponse.setCreatedAt( goal.getCreatedAt() );
        goalResponse.setCurrentAmount( goal.getCurrentAmount() );
        goalResponse.setGoalId( goal.getGoalId() );
        goalResponse.setGoalName( goal.getGoalName() );
        goalResponse.setStatus( goal.getStatus() );
        goalResponse.setTargetAmount( goal.getTargetAmount() );
        goalResponse.setTargetDate( goal.getTargetDate() );
        goalResponse.setUpdatedAt( goal.getUpdatedAt() );

        return goalResponse;
    }

    @Override
    public void updateEntityFromDto(GoalUpdateRequest request, Goal entity) {
        if ( request == null ) {
            return;
        }

        entity.setGoalName( request.getGoalName() );
        entity.setStatus( request.getStatus() );
        entity.setTargetAmount( request.getTargetAmount() );
        entity.setTargetDate( request.getTargetDate() );
    }

    private UUID goalUserUserId(Goal goal) {
        if ( goal == null ) {
            return null;
        }
        User user = goal.getUser();
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
