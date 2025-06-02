package com.sneakershop.service;

import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;

import java.util.List;

public interface BrandService {
    BrandResponse createBrand(BrandCreateRequest request);

    List<BrandResponse> getAllBrands();

    BrandResponse getBrandById(Long id);

    BrandResponse updateBrand(Long id, BrandUpdateRequest request);

    void deleteBrand(Long id);
}
