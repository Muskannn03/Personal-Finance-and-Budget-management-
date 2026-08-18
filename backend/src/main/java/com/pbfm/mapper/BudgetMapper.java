package com.pbfm.mapper;

import com.pbfm.dto.request.BudgetCreateRequest;
import com.pbfm.dto.request.BudgetUpdateRequest;
import com.pbfm.dto.response.BudgetResponse;
import com.pbfm.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface BudgetMapper {

    @Mapping(target = "budgetId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Budget toEntity(BudgetCreateRequest request);

    @Mapping(target = "budgetId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(BudgetUpdateRequest request, @MappingTarget Budget budget);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "category.categoryId", target = "categoryId")
    BudgetResponse toResponse(Budget budget);

    List<BudgetResponse> toResponseList(List<Budget> budgets);

    void updateEntityFromDto(BudgetUpdateRequest request, @org.mapstruct.MappingTarget Budget entity);
}

