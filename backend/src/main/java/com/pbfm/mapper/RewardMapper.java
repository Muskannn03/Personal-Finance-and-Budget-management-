package com.pbfm.mapper;

import com.pbfm.dto.request.RewardCreateRequest;
import com.pbfm.dto.request.RewardUpdateRequest;
import com.pbfm.dto.response.RewardResponse;
import com.pbfm.entity.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface RewardMapper {

    @Mapping(target = "rewardId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "sourceTransaction", ignore = true)
    @Mapping(target = "earnedDate", ignore = true)
    @Mapping(target = "redeemedDate", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Reward toEntity(RewardCreateRequest request);

    @Mapping(target = "rewardId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "sourceTransaction", ignore = true)
    @Mapping(target = "rewardType", ignore = true)
    @Mapping(target = "amount", ignore = true)
    @Mapping(target = "earnedDate", ignore = true)
    @Mapping(target = "expiryDate", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(RewardUpdateRequest request, @MappingTarget Reward reward);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "account.accountId", target = "accountId")
    @Mapping(source = "sourceTransaction.transactionId", target = "sourceTransactionId")
    RewardResponse toResponse(Reward reward);

    List<RewardResponse> toResponseList(List<Reward> rewards);

    void updateEntityFromDto(RewardUpdateRequest request, @org.mapstruct.MappingTarget Reward entity);
}

