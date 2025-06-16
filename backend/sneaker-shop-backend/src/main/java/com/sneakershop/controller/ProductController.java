package com.sneakershop.controller;

import com.sneakershop.dto.request.ProductCreateRequest;
import com.sneakershop.dto.request.ProductFilterRequest;
import com.sneakershop.dto.request.ProductUpdateRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductCreateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .message("Tạo sản phẩm thành công")
                .result(productService.createProduct(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProductById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.getAllProducts(pageable))
                .build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<ProductResponse>> filterProducts(ProductFilterRequest request, Pageable pageable) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.filterProducts(request, pageable))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody @Valid ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .message("Cập nhật sản phẩm thành công")
                .result(productService.updateProduct(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.builder()
                .message("Xóa sản phẩm thành công")
                .build();
    }

    @GetMapping("/{id}/related")
    public ApiResponse<List<ProductResponse>> getRelatedProducts(@PathVariable Long id) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getRelatedProducts(id))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<ProductResponse>> searchProducts(@RequestParam String keyword, Pageable pageable) {
        ProductFilterRequest request = new ProductFilterRequest();
        request.setKeyword(keyword);
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.filterProducts(request, pageable))
                .build();
    }

    @GetMapping("/brand/{brandId}")
    public ApiResponse<Page<ProductResponse>> getProductsByBrand(@PathVariable Long brandId, Pageable pageable) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.getProductsByBrand(brandId, pageable))
                .build();
    }

    @GetMapping("/category/{categoryId}")
    public ApiResponse<Page<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.getProductsByCategory(categoryId, pageable))
                .build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Object> getProductStatistics(@RequestParam(required = false) Integer pageSize) {
        return ApiResponse.builder()
                .result(productService.getProductStatistics(pageSize))
                .build();
    }

    @GetMapping("/latest")
    public ApiResponse<List<ProductResponse>> getLatestProducts(@RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getLatestProducts(limit))
                .build();
    }
}
