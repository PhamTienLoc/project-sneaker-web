package com.sneakershop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandUpdateRequest {
    @NotBlank(message = "BRAND_NAME_MUST_NOT_BE_BLANK")
    String name;
    String description;
    String image;
}
