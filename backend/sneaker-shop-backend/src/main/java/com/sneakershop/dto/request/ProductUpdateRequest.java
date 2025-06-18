package com.sneakershop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    @NotBlank(message = "NAME_MUST_NOT_BE_BLANK")
    String name;

    String description;

    @NotNull(message = "PRICE_MUST_NOT_BE_NULL")
    @Positive(message = "PRICE_MUST_BE_POSITIVE")
    BigDecimal price;
    Set<String> sizes;
    Set<String> colors;

    @NotNull(message = "BRAND_ID_REQUIRED")
    Long brandId;
    Set<Long> categoryIds;
    Boolean isActive;
}
