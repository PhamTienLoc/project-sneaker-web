package com.sneakershop.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private ImageResponse image;
}