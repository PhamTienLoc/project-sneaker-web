package com.sneakershop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFilterRequest {
    Long brandId;
    List<Long> categoryIds;
    Double minPrice;
    Double maxPrice;
    String keyword;
    Boolean isActive;
}
