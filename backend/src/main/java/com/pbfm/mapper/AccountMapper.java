package com.pbfm.mapper;

import com.pbfm.dto.request.AccountCreateRequest;
import com.pbfm.dto.request.AccountUpdateRequest;
import com.pbfm.dto.response.AccountResponse;
import com.pbfm.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface AccountMapper {

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    Account toEntity(AccountCreateRequest request);

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    void updateEntityFromRequest(AccountUpdateRequest request, @MappingTarget Account account);

    @Mapping(target = "userId", source = "user.userId")
    AccountResponse toResponse(Account account);

    void updateEntityFromDto(AccountUpdateRequest request, @org.mapstruct.MappingTarget Account entity);
}

