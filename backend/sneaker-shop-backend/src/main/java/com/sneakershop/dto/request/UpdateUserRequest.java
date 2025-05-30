package com.sneakershop.dto.request;

import lombok.Getter;

@Getter
public class UpdateUserRequest {
    private String name;
    private String email;
    private String password;
}
