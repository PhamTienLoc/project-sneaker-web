package com.sneakershop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {

    @NotBlank(message = "NAME_MUST_NOT_BE_BLANK")
    String name;

    @NotNull(message = "PRICE_MUST_NOT_BE_NULL")
    @Positive(message = "PRICE_MUST_BE_POSITIVE")
    Double price;

    String description;

    @NotNull(message = "BRAND_ID_REQUIRED")
    Long brandId;

    Set<String> sizes;
    Set<String> colors;
    Set<Long> categoryIds;
}

