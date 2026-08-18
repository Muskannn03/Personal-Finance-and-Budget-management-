package com.pbfm.mapper;

import com.pbfm.dto.request.RiskProfileCreateRequest;
import com.pbfm.dto.request.RiskProfileUpdateRequest;
import com.pbfm.dto.response.RiskProfileResponse;
import com.pbfm.entity.RiskProfile;
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
public class RiskProfileMapperImpl implements RiskProfileMapper {

    @Override
    public RiskProfile toEntity(RiskProfileCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        RiskProfile riskProfile = new RiskProfile();

        riskProfile.setProfileType( request.getProfileType() );
        riskProfile.setRiskScore( request.getRiskScore() );

        return riskProfile;
    }

    @Override
    public void updateEntityFromRequest(RiskProfileUpdateRequest request, RiskProfile riskProfile) {
        if ( request == null ) {
            return;
        }

        riskProfile.setProfileType( request.getProfileType() );
        riskProfile.setRiskScore( request.getRiskScore() );
    }

    @Override
    public RiskProfileResponse toResponse(RiskProfile riskProfile) {
        if ( riskProfile == null ) {
            return null;
        }

        RiskProfileResponse riskProfileResponse = new RiskProfileResponse();

        riskProfileResponse.setUserId( riskProfileUserUserId( riskProfile ) );
        riskProfileResponse.setCreatedAt( riskProfile.getCreatedAt() );
        riskProfileResponse.setProfileId( riskProfile.getProfileId() );
        riskProfileResponse.setProfileType( riskProfile.getProfileType() );
        riskProfileResponse.setRiskScore( riskProfile.getRiskScore() );
        riskProfileResponse.setUpdatedAt( riskProfile.getUpdatedAt() );

        return riskProfileResponse;
    }

    @Override
    public List<RiskProfileResponse> toResponseList(List<RiskProfile> riskProfiles) {
        if ( riskProfiles == null ) {
            return null;
        }

        List<RiskProfileResponse> list = new ArrayList<RiskProfileResponse>( riskProfiles.size() );
        for ( RiskProfile riskProfile : riskProfiles ) {
            list.add( toResponse( riskProfile ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromDto(RiskProfileUpdateRequest request, RiskProfile entity) {
        if ( request == null ) {
            return;
        }

        entity.setProfileType( request.getProfileType() );
        entity.setRiskScore( request.getRiskScore() );
    }

    private UUID riskProfileUserUserId(RiskProfile riskProfile) {
        if ( riskProfile == null ) {
            return null;
        }
        User user = riskProfile.getUser();
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
