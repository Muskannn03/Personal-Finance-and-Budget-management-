package com.pbfm.mapper;

import com.pbfm.dto.request.UserCreateRequest;
import com.pbfm.dto.request.UserUpdateRequest;
import com.pbfm.dto.response.UserResponse;
import com.pbfm.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-14T11:15:22+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setCurrencyPreference( request.getCurrencyPreference() );
        user.setEmail( request.getEmail() );
        user.setName( request.getName() );

        return user;
    }

    @Override
    public void updateEntityFromRequest(UserUpdateRequest request, User user) {
        if ( request == null ) {
            return;
        }

        user.setCurrencyPreference( request.getCurrencyPreference() );
        user.setEmail( request.getEmail() );
        user.setName( request.getName() );
    }

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setCreatedAt( user.getCreatedAt() );
        userResponse.setCurrencyPreference( user.getCurrencyPreference() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setName( user.getName() );
        userResponse.setRole( user.getRole() );
        userResponse.setUpdatedAt( user.getUpdatedAt() );
        userResponse.setUserId( user.getUserId() );

        return userResponse;
    }

    @Override
    public void updateEntityFromDto(UserUpdateRequest request, User entity) {
        if ( request == null ) {
            return;
        }

        entity.setCurrencyPreference( request.getCurrencyPreference() );
        entity.setEmail( request.getEmail() );
        entity.setName( request.getName() );
    }
}
