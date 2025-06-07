package com.sneakershop.dto.request;

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
    String name;
    String description;
    BigDecimal price;
    Set<String> sizes;
    Set<String> colors;
    Long brandId;
    Set<Long> categoryIds;
    Boolean isActive;
}
