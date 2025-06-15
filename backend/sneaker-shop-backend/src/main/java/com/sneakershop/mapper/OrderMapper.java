package com.sneakershop.mapper;

import com.sneakershop.dto.response.OrderResponse;
import com.sneakershop.entity.Order;
import com.sneakershop.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "totalAmount", source = "items", qualifiedByName = "calculateTotalAmount")
    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    @Named("calculateTotalAmount")
    default BigDecimal calculateTotalAmount(List<OrderItem> items) {
        if (items == null) {
            return BigDecimal.ZERO;
        }
        return items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}