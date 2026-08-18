package com.pbfm.mapper;

import com.pbfm.dto.request.InvestmentCreateRequest;
import com.pbfm.dto.request.InvestmentUpdateRequest;
import com.pbfm.dto.response.InvestmentResponse;
import com.pbfm.entity.Goal;
import com.pbfm.entity.Investment;
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
public class InvestmentMapperImpl implements InvestmentMapper {

    @Override
    public Investment toEntity(InvestmentCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Investment investment = new Investment();

        investment.setAmount( request.getAmount() );
        investment.setCurrentValue( request.getCurrentValue() );
        investment.setMaturityDate( request.getMaturityDate() );
        investment.setStartDate( request.getStartDate() );
        investment.setType( request.getType() );

        return investment;
    }

    @Override
    public void updateEntityFromRequest(InvestmentUpdateRequest request, Investment investment) {
        if ( request == null ) {
            return;
        }

        investment.setAmount( request.getAmount() );
        investment.setCurrentValue( request.getCurrentValue() );
        investment.setMaturityDate( request.getMaturityDate() );
        investment.setType( request.getType() );
    }

    @Override
    public InvestmentResponse toResponse(Investment investment) {
        if ( investment == null ) {
            return null;
        }

        InvestmentResponse investmentResponse = new InvestmentResponse();

        investmentResponse.setUserId( investmentUserUserId( investment ) );
        investmentResponse.setGoalId( investmentGoalGoalId( investment ) );
        investmentResponse.setAmount( investment.getAmount() );
        investmentResponse.setCreatedAt( investment.getCreatedAt() );
        investmentResponse.setCurrentValue( investment.getCurrentValue() );
        investmentResponse.setInvestmentId( investment.getInvestmentId() );
        investmentResponse.setMaturityDate( investment.getMaturityDate() );
        investmentResponse.setStartDate( investment.getStartDate() );
        investmentResponse.setType( investment.getType() );
        investmentResponse.setUpdatedAt( investment.getUpdatedAt() );

        return investmentResponse;
    }

    @Override
    public void updateEntityFromDto(InvestmentUpdateRequest request, Investment entity) {
        if ( request == null ) {
            return;
        }

        entity.setAmount( request.getAmount() );
        entity.setCurrentValue( request.getCurrentValue() );
        entity.setMaturityDate( request.getMaturityDate() );
        entity.setType( request.getType() );
    }

    private UUID investmentUserUserId(Investment investment) {
        if ( investment == null ) {
            return null;
        }
        User user = investment.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private UUID investmentGoalGoalId(Investment investment) {
        if ( investment == null ) {
            return null;
        }
        Goal goal = investment.getGoal();
        if ( goal == null ) {
            return null;
        }
        UUID goalId = goal.getGoalId();
        if ( goalId == null ) {
            return null;
        }
        return goalId;
    }
}
