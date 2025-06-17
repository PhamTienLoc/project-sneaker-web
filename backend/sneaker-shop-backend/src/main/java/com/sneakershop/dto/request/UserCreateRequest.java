package com.sneakershop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {
    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 3, max = 50, message = "INVALID_USERNAME")
    String username;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL_FORMAT")
    String email;

    @NotBlank(message = "FIRSTNAME_REQUIRED")
    String firstName;

    @NotBlank(message = "LASTNAME_REQUIRED")
    String lastName;

    @Pattern(regexp = "^\\d{10}$", message = "INVALID_PHONE_NUMBER")
    String phoneNumber;

    String address;
}