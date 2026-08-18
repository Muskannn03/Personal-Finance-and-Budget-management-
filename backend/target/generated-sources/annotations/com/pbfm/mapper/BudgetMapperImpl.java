package com.pbfm.mapper;

import com.pbfm.dto.request.BudgetCreateRequest;
import com.pbfm.dto.request.BudgetUpdateRequest;
import com.pbfm.dto.response.BudgetResponse;
import com.pbfm.entity.Budget;
import com.pbfm.entity.Category;
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
public class BudgetMapperImpl implements BudgetMapper {

    @Override
    public Budget toEntity(BudgetCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Budget budget = new Budget();

        budget.setEndDate( request.getEndDate() );
        budget.setLimitAmount( request.getLimitAmount() );
        budget.setPeriod( request.getPeriod() );
        budget.setStartDate( request.getStartDate() );

        return budget;
    }

    @Override
    public void updateEntityFromRequest(BudgetUpdateRequest request, Budget budget) {
        if ( request == null ) {
            return;
        }

        budget.setEndDate( request.getEndDate() );
        budget.setLimitAmount( request.getLimitAmount() );
        budget.setPeriod( request.getPeriod() );
        budget.setStartDate( request.getStartDate() );
    }

    @Override
    public BudgetResponse toResponse(Budget budget) {
        if ( budget == null ) {
            return null;
        }

        BudgetResponse budgetResponse = new BudgetResponse();

        budgetResponse.setUserId( budgetUserUserId( budget ) );
        budgetResponse.setCategoryId( budgetCategoryCategoryId( budget ) );
        budgetResponse.setBudgetId( budget.getBudgetId() );
        budgetResponse.setCreatedAt( budget.getCreatedAt() );
        budgetResponse.setEndDate( budget.getEndDate() );
        budgetResponse.setLimitAmount( budget.getLimitAmount() );
        budgetResponse.setPeriod( budget.getPeriod() );
        budgetResponse.setStartDate( budget.getStartDate() );
        budgetResponse.setUpdatedAt( budget.getUpdatedAt() );

        return budgetResponse;
    }

    @Override
    public List<BudgetResponse> toResponseList(List<Budget> budgets) {
        if ( budgets == null ) {
            return null;
        }

        List<BudgetResponse> list = new ArrayList<BudgetResponse>( budgets.size() );
        for ( Budget budget : budgets ) {
            list.add( toResponse( budget ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromDto(BudgetUpdateRequest request, Budget entity) {
        if ( request == null ) {
            return;
        }

        entity.setEndDate( request.getEndDate() );
        entity.setLimitAmount( request.getLimitAmount() );
        entity.setPeriod( request.getPeriod() );
        entity.setStartDate( request.getStartDate() );
    }

    private UUID budgetUserUserId(Budget budget) {
        if ( budget == null ) {
            return null;
        }
        User user = budget.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private UUID budgetCategoryCategoryId(Budget budget) {
        if ( budget == null ) {
            return null;
        }
        Category category = budget.getCategory();
        if ( category == null ) {
            return null;
        }
        UUID categoryId = category.getCategoryId();
        if ( categoryId == null ) {
            return null;
        }
        return categoryId;
    }
}
