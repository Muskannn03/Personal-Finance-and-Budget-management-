package com.pbfm.mapper;

import com.pbfm.dto.request.RiskProfileCreateRequest;
import com.pbfm.dto.request.RiskProfileUpdateRequest;
import com.pbfm.dto.response.RiskProfileResponse;
import com.pbfm.entity.RiskProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface RiskProfileMapper {

    @Mapping(target = "profileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    RiskProfile toEntity(RiskProfileCreateRequest request);

    @Mapping(target = "profileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(RiskProfileUpdateRequest request, @MappingTarget RiskProfile riskProfile);

    @Mapping(source = "user.userId", target = "userId")
    RiskProfileResponse toResponse(RiskProfile riskProfile);

    List<RiskProfileResponse> toResponseList(List<RiskProfile> riskProfiles);

    void updateEntityFromDto(RiskProfileUpdateRequest request, @org.mapstruct.MappingTarget RiskProfile entity);
}

