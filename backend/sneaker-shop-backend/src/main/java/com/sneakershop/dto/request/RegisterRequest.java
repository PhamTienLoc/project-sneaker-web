package com.sneakershop.dto.request;

import lombok.*;

@Getter @Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}
