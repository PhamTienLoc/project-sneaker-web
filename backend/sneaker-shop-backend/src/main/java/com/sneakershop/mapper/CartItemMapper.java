package com.sneakershop.mapper;

import com.sneakershop.dto.response.CartItemResponse;
import com.sneakershop.dto.response.ImageResponse;
import com.sneakershop.entity.CartItem;
import com.sneakershop.service.ImageService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class CartItemMapper {
    @Autowired
    protected ImageService imageService;

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "subtotal", expression = "java(item.getPrice() * item.getQuantity())")
    @Mapping(target = "image", source = "product", qualifiedByName = "getFirstImage")
    public abstract CartItemResponse toResponse(CartItem item);

    @Named("getFirstImage")
    protected ImageResponse getFirstImage(com.sneakershop.entity.Product product) {
        if (product == null) {
            return null;
        }
        try {
            List<ImageResponse> images = imageService.getImagesByObject("product", product.getId());
            return images.isEmpty() ? null : images.get(0);
        } catch (Exception e) {
            return null;
        }
    }
} 