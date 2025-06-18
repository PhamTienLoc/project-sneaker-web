package com.sneakershop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String size;
    private String color;
    private Integer quantity;
    private Double price;
    private Double subtotal;
    private ImageResponse image;
} 