package com.sneakershop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    String name;
    Double price;
    String description;
    Long brandId;
    Set<String> sizes;
    Set<String> colors;
    Set<Long> categoryIds;
}
