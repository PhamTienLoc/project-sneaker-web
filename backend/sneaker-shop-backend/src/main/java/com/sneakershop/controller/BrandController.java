package com.sneakershop.controller;

import com.sneakershop.dto.request.ApiResponse;
import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import com.sneakershop.service.BrandService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandController {
    BrandService brandService;

    @PostMapping
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
    public ApiResponse<List<BrandResponse>> getAllBrands() {
        return ApiResponse.<List<BrandResponse>>builder()
                .result(brandService.getAllBrands())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BrandResponse> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandUpdateRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .message("Cập nhật thương hiệu thành công")
                .result(brandService.updateBrand(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ApiResponse.<Void>builder()
                .message("Xóa thương hiệu thành công")
                .build();
    }
}

