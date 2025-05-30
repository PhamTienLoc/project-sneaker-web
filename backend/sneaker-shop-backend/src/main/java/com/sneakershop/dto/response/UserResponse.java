package com.sneakershop.dto.response;

import lombok.*;

@Getter @Setter
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
}
