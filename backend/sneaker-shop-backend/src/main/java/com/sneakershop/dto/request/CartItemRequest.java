package com.sneakershop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Size is required")
    private String size;

    @NotBlank(message = "Color is required")
    private String color;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}