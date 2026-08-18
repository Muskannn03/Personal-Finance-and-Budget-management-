package com.pbfm.mapper;

import com.pbfm.dto.request.TransactionCreateRequest;
import com.pbfm.dto.request.TransactionUpdateRequest;
import com.pbfm.dto.response.TransactionResponse;
import com.pbfm.entity.Account;
import com.pbfm.entity.Category;
import com.pbfm.entity.Transaction;
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
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionResponse toResponse(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        TransactionResponse transactionResponse = new TransactionResponse();

        transactionResponse.setUserId( transactionUserUserId( transaction ) );
        transactionResponse.setAccountId( transactionAccountAccountId( transaction ) );
        transactionResponse.setCategoryId( transactionCategoryCategoryId( transaction ) );
        transactionResponse.setAmount( transaction.getAmount() );
        transactionResponse.setCreatedAt( transaction.getCreatedAt() );
        transactionResponse.setDate( transaction.getDate() );
        transactionResponse.setTransactionId( transaction.getTransactionId() );
        transactionResponse.setType( transaction.getType() );
        transactionResponse.setUpdatedAt( transaction.getUpdatedAt() );

        return transactionResponse;
    }

    @Override
    public Transaction toEntity(TransactionCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Transaction transaction = new Transaction();

        transaction.setAmount( request.getAmount() );
        transaction.setDate( request.getDate() );
        transaction.setType( request.getType() );

        return transaction;
    }

    @Override
    public void updateEntity(TransactionUpdateRequest request, Transaction transaction) {
        if ( request == null ) {
            return;
        }

        transaction.setAmount( request.getAmount() );
        transaction.setDate( request.getDate() );
        transaction.setType( request.getType() );
    }

    @Override
    public void updateEntityFromDto(TransactionUpdateRequest request, Transaction entity) {
        if ( request == null ) {
            return;
        }

        entity.setAmount( request.getAmount() );
        entity.setDate( request.getDate() );
        entity.setType( request.getType() );
    }

    private UUID transactionUserUserId(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        User user = transaction.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private UUID transactionAccountAccountId(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Account account = transaction.getAccount();
        if ( account == null ) {
            return null;
        }
        UUID accountId = account.getAccountId();
        if ( accountId == null ) {
            return null;
        }
        return accountId;
    }

    private UUID transactionCategoryCategoryId(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Category category = transaction.getCategory();
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
