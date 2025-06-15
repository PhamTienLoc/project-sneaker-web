package com.sneakershop.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private Double totalAmount;
    private Integer totalItems;
}