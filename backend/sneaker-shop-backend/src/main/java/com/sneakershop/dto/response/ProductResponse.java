package com.sneakershop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String name;
    String description;
    BigDecimal price;
    Set<String> sizes;
    Set<String> colors;
    BrandResponse brand;
    List<CategoryResponse> categories;
    List<ImageResponse> images;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}

