package com.sneakershop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFilterRequest {
    Long brandId;
    List<Long> categoryIds;
    BigDecimal minPrice;
    BigDecimal maxPrice;
    String keyword;
    Set<String> colors;
    Set<String> sizes;
    Boolean isActive;
}
