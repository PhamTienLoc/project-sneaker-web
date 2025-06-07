package com.sneakershop.service.impl;

import com.sneakershop.dto.request.CategoryCreateRequest;
import com.sneakershop.dto.request.CategoryUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;
import com.sneakershop.entity.Category;
import com.sneakershop.exception.AppException;
import com.sneakershop.mapper.CategoryMapper;
import com.sneakershop.repository.CategoryRepository;
import com.sneakershop.service.CategoryService;
import com.sneakershop.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    @Override
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }
        Category category = categoryMapper.toCategory(request);

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        return categoryMapper.toCategoryResponse(categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
    }

    @Override
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(categoryMapper::toCategoryResponse);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.updateCategory(category, request);

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        categoryRepository.deleteById(id);
    }
}
