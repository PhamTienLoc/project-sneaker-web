package com.sneakershop.mapper;

import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import com.sneakershop.entity.Brand;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandCreateRequest request);

    BrandResponse toBrandResponse(Brand brand);

    void updateBrand(@MappingTarget Brand brand, BrandUpdateRequest request);
}
