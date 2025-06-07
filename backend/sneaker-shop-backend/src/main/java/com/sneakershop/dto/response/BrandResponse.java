package com.sneakershop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandResponse {
    Long id;
    String name;
    String description;
    List<ImageResponse> images;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}