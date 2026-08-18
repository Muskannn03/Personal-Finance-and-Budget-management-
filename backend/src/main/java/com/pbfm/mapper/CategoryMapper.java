package com.pbfm.mapper;

import com.pbfm.dto.request.CategoryCreateRequest;
import com.pbfm.dto.request.CategoryUpdateRequest;
import com.pbfm.dto.response.CategoryResponse;
import com.pbfm.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface CategoryMapper {

    @Mapping(target = "userId", source = "user.userId")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Category toEntity(CategoryCreateRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(CategoryUpdateRequest request, @MappingTarget Category category);

    void updateEntityFromDto(CategoryUpdateRequest request, @org.mapstruct.MappingTarget Category entity);
}

