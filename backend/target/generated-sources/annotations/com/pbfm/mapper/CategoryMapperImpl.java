package com.pbfm.mapper;

import com.pbfm.dto.request.CategoryCreateRequest;
import com.pbfm.dto.request.CategoryUpdateRequest;
import com.pbfm.dto.response.CategoryResponse;
import com.pbfm.entity.Category;
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
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryResponse toResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setUserId( categoryUserUserId( category ) );
        categoryResponse.setCategoryId( category.getCategoryId() );
        categoryResponse.setCategoryName( category.getCategoryName() );
        categoryResponse.setCreatedAt( category.getCreatedAt() );
        categoryResponse.setType( category.getType() );
        categoryResponse.setUpdatedAt( category.getUpdatedAt() );

        return categoryResponse;
    }

    @Override
    public Category toEntity(CategoryCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Category category = new Category();

        category.setCategoryName( request.getCategoryName() );
        category.setType( request.getType() );

        return category;
    }

    @Override
    public void updateEntity(CategoryUpdateRequest request, Category category) {
        if ( request == null ) {
            return;
        }

        category.setCategoryName( request.getCategoryName() );
        category.setType( request.getType() );
    }

    @Override
    public void updateEntityFromDto(CategoryUpdateRequest request, Category entity) {
        if ( request == null ) {
            return;
        }

        entity.setCategoryName( request.getCategoryName() );
        entity.setType( request.getType() );
    }

    private UUID categoryUserUserId(Category category) {
        if ( category == null ) {
            return null;
        }
        User user = category.getUser();
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
