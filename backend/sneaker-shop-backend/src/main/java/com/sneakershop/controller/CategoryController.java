package com.sneakershop.controller;

import com.sneakershop.dto.request.CategoryCreateRequest;
import com.sneakershop.dto.request.CategoryUpdateRequest;
import com.sneakershop.dto.response.CategoryResponse;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryCreateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Tạo danh mục thành công")
                .result(categoryService.createCategory(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoryById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<CategoryResponse>> getAllCategories(Pageable pageable) {
        return ApiResponse.<Page<CategoryResponse>>builder()
                .result(categoryService.getAllCategories(pageable))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryUpdateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Cập nhật danh mục thành công")
                .result(categoryService.updateCategory(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<Void>builder()
                .message("Xóa danh mục thành công")
                .build();
    }
}
