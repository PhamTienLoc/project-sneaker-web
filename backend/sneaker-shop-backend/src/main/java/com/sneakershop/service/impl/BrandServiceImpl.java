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
import com.sneakershop.service.ImageService;
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
public class BrandServiceImpl implements BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;
    ImageService imageService;

    @Override
    public BrandResponse createBrand(BrandCreateRequest request) {
        if (brandRepository.existsByNameIgnoreCase(request.getName())) {
            throw new AppException(ErrorCode.BRAND_NAME_EXISTS);
        }

        Brand brand = brandMapper.toBrand(request);

        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Override
    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        BrandResponse response = brandMapper.toBrandResponse(brand);

        response.setImages(imageService.getImagesByObject("brand", brand.getId()));

        return response;
    }

    @Override
    public Page<BrandResponse> getAllBrands(Pageable pageable) {
        return brandRepository.findAll(pageable).map(brand -> {
            BrandResponse response = brandMapper.toBrandResponse(brand);
            response.setImages(imageService.getImagesByObject("brand", brand.getId()));
            return response;
        });
    }

    @Override
    public BrandResponse updateBrand(Long id, BrandUpdateRequest request) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        brandMapper.updateBrand(brand, request);

        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Override
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        brandRepository.deleteById(id);
    }
}

