package com.sneakershop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "PRODUCT_ID_REQUIRED")
    private Long productId;

    @NotBlank(message = "SIZE_REQUIRED")
    private String size;

    @NotBlank(message = "COLOR_REQUIRED")
    private String color;

    @NotNull(message = "QUANTITY_REQUIRED")
    @Min(value = 1, message = "QUANTITY_MINIMUM")
    private Integer quantity;
}