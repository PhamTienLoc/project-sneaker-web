package com.sneakershop.controller;

import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import com.sneakershop.service.BrandService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandController {
    BrandService brandService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BrandResponse> createBrand(@Valid @RequestBody BrandCreateRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .message("Tạo thương hiệu thành công")
                .result(brandService.createBrand(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BrandResponse> getBrand(@PathVariable Long id) {
        return ApiResponse.<BrandResponse>builder()
                .result(brandService.getBrandById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<BrandResponse>> getAllBrands(Pageable pageable) {
        return ApiResponse.<Page<BrandResponse>>builder()
                .result(brandService.getAllBrands(pageable))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BrandResponse> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandUpdateRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .message("Cập nhật thương hiệu thành công")
                .result(brandService.updateBrand(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ApiResponse.<Void>builder()
                .message("Xóa thương hiệu thành công")
                .build();
    }
}

