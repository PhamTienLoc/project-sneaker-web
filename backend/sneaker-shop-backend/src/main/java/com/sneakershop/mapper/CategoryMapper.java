package com.sneakershop.mapper;

import com.sneakershop.dto.request.CategoryCreateRequest;
import com.sneakershop.dto.request.CategoryUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;
import com.sneakershop.entity.Category;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);

    CategoryResponse toCategoryResponse(Category category);
}
