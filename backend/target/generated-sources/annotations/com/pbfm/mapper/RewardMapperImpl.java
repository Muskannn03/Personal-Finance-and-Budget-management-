package com.pbfm.mapper;

import com.pbfm.dto.request.RewardCreateRequest;
import com.pbfm.dto.request.RewardUpdateRequest;
import com.pbfm.dto.response.RewardResponse;
import com.pbfm.entity.Account;
import com.pbfm.entity.Reward;
import com.pbfm.entity.Transaction;
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
public class RewardMapperImpl implements RewardMapper {

    @Override
    public Reward toEntity(RewardCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Reward reward = new Reward();

        reward.setAmount( request.getAmount() );
        reward.setExpiryDate( request.getExpiryDate() );
        reward.setRewardType( request.getRewardType() );
        reward.setStatus( request.getStatus() );

        return reward;
    }

    @Override
    public void updateEntityFromRequest(RewardUpdateRequest request, Reward reward) {
        if ( request == null ) {
            return;
        }

        reward.setRedeemedDate( request.getRedeemedDate() );
        reward.setStatus( request.getStatus() );
    }

    @Override
    public RewardResponse toResponse(Reward reward) {
        if ( reward == null ) {
            return null;
        }

        RewardResponse rewardResponse = new RewardResponse();

        rewardResponse.setUserId( rewardUserUserId( reward ) );
        rewardResponse.setAccountId( rewardAccountAccountId( reward ) );
        rewardResponse.setSourceTransactionId( rewardSourceTransactionTransactionId( reward ) );
        rewardResponse.setAmount( reward.getAmount() );
        rewardResponse.setCreatedAt( reward.getCreatedAt() );
        rewardResponse.setEarnedDate( reward.getEarnedDate() );
        rewardResponse.setExpiryDate( reward.getExpiryDate() );
        rewardResponse.setRedeemedDate( reward.getRedeemedDate() );
        rewardResponse.setRewardId( reward.getRewardId() );
        rewardResponse.setRewardType( reward.getRewardType() );
        rewardResponse.setStatus( reward.getStatus() );
        rewardResponse.setUpdatedAt( reward.getUpdatedAt() );

        return rewardResponse;
    }

    @Override
    public List<RewardResponse> toResponseList(List<Reward> rewards) {
        if ( rewards == null ) {
            return null;
        }

        List<RewardResponse> list = new ArrayList<RewardResponse>( rewards.size() );
        for ( Reward reward : rewards ) {
            list.add( toResponse( reward ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromDto(RewardUpdateRequest request, Reward entity) {
        if ( request == null ) {
            return;
        }

        entity.setRedeemedDate( request.getRedeemedDate() );
        entity.setStatus( request.getStatus() );
    }

    private UUID rewardUserUserId(Reward reward) {
        if ( reward == null ) {
            return null;
        }
        User user = reward.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private UUID rewardAccountAccountId(Reward reward) {
        if ( reward == null ) {
            return null;
        }
        Account account = reward.getAccount();
        if ( account == null ) {
            return null;
        }
        UUID accountId = account.getAccountId();
        if ( accountId == null ) {
            return null;
        }
        return accountId;
    }

    private UUID rewardSourceTransactionTransactionId(Reward reward) {
        if ( reward == null ) {
            return null;
        }
        Transaction sourceTransaction = reward.getSourceTransaction();
        if ( sourceTransaction == null ) {
            return null;
        }
        UUID transactionId = sourceTransaction.getTransactionId();
        if ( transactionId == null ) {
            return null;
        }
        return transactionId;
    }
}
