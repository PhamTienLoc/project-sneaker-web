package com.sneakershop.mapper;

import com.sneakershop.dto.request.ProductRequest;
import com.sneakershop.dto.response.ProductResponse;
import com.sneakershop.entity.*;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "images", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "imageLinks", ignore = true) // custom sau
    @Mapping(target = "categoryNames", ignore = true)
    ProductResponse toProductResponse(Product product);

    @AfterMapping
    default void mapImagesAndCategories(Product product, @MappingTarget ProductResponse response) {
        Set<Image> images = product.getImages();
        Set<Category> categories = product.getCategories();

        if (images != null) {
            List<String> imageLinks = images.stream().map(Image::getUrl).collect(Collectors.toList());
            response.setImageLinks(imageLinks);
        }

        if (categories != null) {
            List<String> categoryNames = categories.stream().map(Category::getName).collect(Collectors.toList());
            response.setCategoryNames(categoryNames);
        }
    }
}
