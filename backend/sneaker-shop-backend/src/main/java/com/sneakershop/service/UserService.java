package com.sneakershop.service;

import com.sneakershop.dto.request.RegisterRequest;
import com.sneakershop.entity.User;

public interface UserService {
    User register(RegisterRequest request);
    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}