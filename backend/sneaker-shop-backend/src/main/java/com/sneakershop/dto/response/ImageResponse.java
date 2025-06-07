package com.sneakershop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageResponse {
    Long id;
    String path;
    String type;
    Long objectId;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}