package com.sneakershop.mapper;

import com.sneakershop.dto.request.BrandUpdateRequest;
import com.sneakershop.dto.request.ProductCreateRequest;
import com.sneakershop.dto.request.ProductUpdateRequest;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.entity.Brand;
import com.sneakershop.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BrandMapper.class, ImageMapper.class, CategoryMapper.class})
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "categories", ignore = true)
    Product toProduct(ProductCreateRequest request);

    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "categories", source = "categories")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "categories", ignore = true)
    void updateProduct(ProductUpdateRequest request, @MappingTarget Product product);
}
