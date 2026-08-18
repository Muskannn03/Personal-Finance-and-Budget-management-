package com.pbfm.mapper;

import com.pbfm.dto.request.TransactionCreateRequest;
import com.pbfm.dto.request.TransactionUpdateRequest;
import com.pbfm.dto.response.TransactionResponse;
import com.pbfm.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface TransactionMapper {

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "accountId", source = "account.accountId")
    @Mapping(target = "categoryId", source = "category.categoryId")
    TransactionResponse toResponse(Transaction transaction);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Transaction toEntity(TransactionCreateRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(TransactionUpdateRequest request, @MappingTarget Transaction transaction);

    void updateEntityFromDto(TransactionUpdateRequest request, @org.mapstruct.MappingTarget Transaction entity);
}

