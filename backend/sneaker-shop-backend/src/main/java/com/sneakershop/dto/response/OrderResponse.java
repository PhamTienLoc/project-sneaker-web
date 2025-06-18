package com.sneakershop.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.sneakershop.constant.OrderStatus;

@Data
public class OrderResponse {
    private Long id;
    private UserResponse user;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String phoneNumber;
    private String email;
    private OrderStatus status;
    private String paymentMethod;
    private String paymentStatus;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}