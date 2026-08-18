package com.pbfm.mapper;

import com.pbfm.dto.request.InvestmentCreateRequest;
import com.pbfm.dto.request.InvestmentUpdateRequest;
import com.pbfm.dto.response.InvestmentResponse;
import com.pbfm.entity.Investment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface InvestmentMapper {

    @Mapping(target = "investmentId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "goal", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Investment toEntity(InvestmentCreateRequest request);

    @Mapping(target = "investmentId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "goal", ignore = true)
    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromRequest(InvestmentUpdateRequest request, @MappingTarget Investment investment);

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "goalId", source = "goal.goalId")
    InvestmentResponse toResponse(Investment investment);

    void updateEntityFromDto(InvestmentUpdateRequest request, @org.mapstruct.MappingTarget Investment entity);
}

