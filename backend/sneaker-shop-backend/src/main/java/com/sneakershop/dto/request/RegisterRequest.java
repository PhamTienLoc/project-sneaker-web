package com.sneakershop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 3, max = 50, message = "INVALID_USERNAME")
    private String username;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL_FORMAT")
    private String email;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, max = 40, message = "INVALID_PASSWORD")
    private String password;

    @NotBlank(message = "FIRSTNAME_REQUIRED")
    String firstName;

    @NotBlank(message = "LASTNAME_REQUIRED")
    String lastName;

    @Pattern(regexp = "^\\d{10}$", message = "INVALID_PHONE_NUMBER")
    private String phoneNumber;

    private String address;
}