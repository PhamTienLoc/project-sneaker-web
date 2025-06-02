package com.sneakershop.service.impl;

import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import com.sneakershop.entity.Brand;
import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.mapper.BrandMapper;
import com.sneakershop.repository.BrandRepository;
import com.sneakershop.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Override
    public BrandResponse createBrand(BrandCreateRequest request) {
        Brand brand = brandMapper.toBrand(request);

        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Override
    public BrandResponse getBrandById(Long id) {
        return brandMapper.toBrandResponse(brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
    }

    @Override
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream().map(brandMapper::toBrandResponse).toList();
    }

    @Override
    public BrandResponse updateBrand(Long id, BrandUpdateRequest request) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        brandMapper.updateBrand(brand, request);

        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Override
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}

