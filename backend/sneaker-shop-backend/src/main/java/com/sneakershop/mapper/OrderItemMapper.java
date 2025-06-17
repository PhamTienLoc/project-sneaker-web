package com.sneakershop.mapper;

import com.sneakershop.dto.response.ImageResponse;
import com.sneakershop.dto.response.OrderItemResponse;
import com.sneakershop.entity.OrderItem;
import com.sneakershop.entity.Product;
import com.sneakershop.service.ImageService;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ImageService.class})
public abstract class OrderItemMapper {
    @Autowired
    protected ImageService imageService;

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "subtotal", source = ".", qualifiedByName = "calculateSubtotal")
    @Mapping(target = "image", source = "product", qualifiedByName = "getFirstImage")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    public abstract OrderItemResponse toResponse(OrderItem orderItem);

    @Named("calculateSubtotal")
    protected BigDecimal calculateSubtotal(OrderItem item) {
        return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    @Named("getFirstImage")
    protected ImageResponse getFirstImage(Product product) {
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