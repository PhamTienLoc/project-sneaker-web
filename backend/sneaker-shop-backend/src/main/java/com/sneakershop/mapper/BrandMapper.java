package com.sneakershop.mapper;

import com.sneakershop.dto.request.BrandCreateRequest;
import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.response.BrandResponse;
import com.sneakershop.entity.Brand;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandCreateRequest request);

    BrandResponse toBrandResponse(Brand brand);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBrand(@MappingTarget Brand brand, BrandUpdateRequest request);
}
