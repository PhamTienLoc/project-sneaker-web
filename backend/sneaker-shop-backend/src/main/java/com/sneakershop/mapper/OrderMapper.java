package com.sneakershop.mapper;

import com.sneakershop.dto.request.OrderRequest;
import com.sneakershop.dto.request.OrderUpdateRequest;
import com.sneakershop.dto.response.OrderResponse;
import com.sneakershop.entity.Order;
import com.sneakershop.entity.OrderItem;
import org.mapstruct.BeanMapping;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, UserMapper.class})
public interface OrderMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "paymentStatus", source = "paymentStatus")
    @Mapping(target = "note", source = "note")
    Order toEntity(OrderRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "paymentStatus", source = "paymentStatus")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "note", source = "note")
    void updateOrder(@MappingTarget Order order, OrderUpdateRequest request);

    @InheritInverseConfiguration(name = "toEntity")
    @Mapping(target = "totalAmount", source = "items", qualifiedByName = "calculateTotalAmount")
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