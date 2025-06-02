package com.sneakershop.service;

import com.sneakershop.dto.request.CategoryCreateRequest;
import com.sneakershop.dto.request.CategoryUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryCreateRequest request);

    CategoryResponse getCategoryById(Long id);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long id, CategoryUpdateRequest request);

    void deleteCategory(Long id);
}
