package com.sneakershop.dto.response;

import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    String address;
    List<String> roles;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}