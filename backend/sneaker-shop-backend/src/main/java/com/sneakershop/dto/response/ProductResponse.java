package com.sneakershop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
    Double price;
    Set<String> sizes;
    Set<String> colors;
    String brandName;
    List<String> imageLinks;
    List<String> categoryNames;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

