package com.sneakershop.service;

import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface BrandService {
    BrandResponse createBrand(BrandCreateRequest request);

    Page<BrandResponse> getAllBrands(Pageable pageable);

    BrandResponse getBrandById(Long id);

    BrandResponse updateBrand(Long id, BrandUpdateRequest request);

    void deleteBrand(Long id);
}
