package com.sneakershop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "INVALID_OLD_PASSWORD")
    private String oldPassword;

    @NotBlank(message = "INVALID_NEW_PASSWORD")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "INVALID_NEW_PASSWORD")
    private String newPassword;
}