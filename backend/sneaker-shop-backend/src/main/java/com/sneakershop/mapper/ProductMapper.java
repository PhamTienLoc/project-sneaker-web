package com.sneakershop.mapper;

import com.sneakershop.dto.request.ProductRequest;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand.id", source = "brandId")
    Product toProduct(ProductRequest request);

    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "imageLinks", expression = "java(product.getImages().stream().map(Image::getUrl).collect(Collectors.toList()))")
    @Mapping(target = "categoryNames", expression = "java(product.getCategories().stream().map(Category::getName).collect(Collectors.toList()))")
    ProductResponse toProductResponse(Product product);
}
