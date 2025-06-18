package com.sneakershop.service;

import com.sneakershop.dto.request.CategoryCreateRequest;
import com.sneakershop.dto.request.CategoryUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CategoryService {

    CategoryResponse createCategory(CategoryCreateRequest request);

    CategoryResponse getCategoryById(Long id);

    Page<CategoryResponse> getAllCategories(Pageable pageable);

    CategoryResponse updateCategory(Long id, CategoryUpdateRequest request);

    void deleteCategory(Long id);
}
