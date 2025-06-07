package com.sneakershop.service;

import com.sneakershop.dto.request.ProductCreateRequest;
import com.sneakershop.dto.request.ProductFilterRequest;
import com.sneakershop.dto.request.ProductUpdateRequest;
import com.sneakershop.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ProductService {
    ProductResponse createProduct(ProductCreateRequest request);

    ProductResponse getProductById(Long id);

    Page<ProductResponse> getAllProducts(Pageable pageable);

    Page<ProductResponse> filterProducts(ProductFilterRequest filter, Pageable pageable);

    ProductResponse updateProduct(Long id, ProductUpdateRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getRelatedProducts(Long productId);

    Page<ProductResponse> getProductsByBrand(Long brandId, Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Map<String, Object> getProductStatistics(Integer pageSize);

    List<ProductResponse> getLatestProducts(int limit);
}
