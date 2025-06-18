package com.sneakershop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryUpdateRequest {
    @NotBlank(message = "CATEGORY_NAME_BLANK")
    String name;

    String description;
    Boolean isActive;
}