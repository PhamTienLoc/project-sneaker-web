package com.sneakershop.mapper;

import com.sneakershop.dto.response.CartResponse;
import com.sneakershop.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmount(cart))")
    @Mapping(target = "totalItems", expression = "java(calculateTotalItems(cart))")
    CartResponse toResponse(Cart cart);

    default Double calculateTotalAmount(Cart cart) {
        return cart.getItems().stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
    }

    default Integer calculateTotalItems(Cart cart) {
        return cart.getItems().stream().mapToInt(item -> item.getQuantity()).sum();
    }
}