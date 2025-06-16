package com.sneakershop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "FIRSTNAME_REQUIRED")
    private String firstName;

    @NotBlank(message = "LASTNAME_REQUIRED")
    private String lastName;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL_FORMAT")
    private String email;

    @NotBlank(message = "PHONE_NUMBER_REQUIRED")
    @Pattern(regexp = "^\\d{10}$", message = "INVALID_PHONE_NUMBER")
    private String phoneNumber;

    @NotBlank(message = "ADDRESS_REQUIRED")
    private String address;
}