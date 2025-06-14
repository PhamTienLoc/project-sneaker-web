package com.sneakershop.mapper;

import com.sneakershop.dto.request.ProductCreateRequest;
import com.sneakershop.dto.request.ProductUpdateRequest;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.entity.Product;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {BrandMapper.class, ImageMapper.class, CategoryMapper.class})
public interface ProductMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProduct(ProductUpdateRequest request, @MappingTarget Product product);

    Product toProduct(ProductCreateRequest request);

    @Mapping(source = "brand", target = "brand")
    ProductResponse toProductResponse(Product product);
}
