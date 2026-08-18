package com.pbfm.mapper;

import com.pbfm.dto.request.AccountCreateRequest;
import com.pbfm.dto.request.AccountUpdateRequest;
import com.pbfm.dto.response.AccountResponse;
import com.pbfm.entity.Account;
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
public class AccountMapperImpl implements AccountMapper {

    @Override
    public Account toEntity(AccountCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Account account = new Account();

        account.setAccountName( request.getAccountName() );
        account.setAccountType( request.getAccountType() );
        account.setBalance( request.getBalance() );

        return account;
    }

    @Override
    public void updateEntityFromRequest(AccountUpdateRequest request, Account account) {
        if ( request == null ) {
            return;
        }

        account.setAccountName( request.getAccountName() );
        account.setAccountType( request.getAccountType() );
        account.setBalance( request.getBalance() );
    }

    @Override
    public AccountResponse toResponse(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountResponse accountResponse = new AccountResponse();

        accountResponse.setUserId( accountUserUserId( account ) );
        accountResponse.setAccountId( account.getAccountId() );
        accountResponse.setAccountName( account.getAccountName() );
        accountResponse.setAccountType( account.getAccountType() );
        accountResponse.setBalance( account.getBalance() );
        accountResponse.setCreatedAt( account.getCreatedAt() );
        accountResponse.setUpdatedAt( account.getUpdatedAt() );

        return accountResponse;
    }

    @Override
    public void updateEntityFromDto(AccountUpdateRequest request, Account entity) {
        if ( request == null ) {
            return;
        }

        entity.setAccountName( request.getAccountName() );
        entity.setAccountType( request.getAccountType() );
        entity.setBalance( request.getBalance() );
    }

    private UUID accountUserUserId(Account account) {
        if ( account == null ) {
            return null;
        }
        User user = account.getUser();
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
