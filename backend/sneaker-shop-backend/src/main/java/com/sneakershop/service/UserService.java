package com.sneakershop.service;

import com.sneakershop.dto.request.ChangePasswordRequest;
import com.sneakershop.dto.request.RegisterRequest;
import com.sneakershop.dto.request.UserCreateRequest;
import com.sneakershop.dto.request.UserUpdateRequest;
import com.sneakershop.dto.response.UserResponse;
import com.sneakershop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    User register(RegisterRequest request);
    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    UserResponse getCurrentUser(Long userId);
    UserResponse updateUser(Long userId, UserUpdateRequest request);
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(Long id);
    void deleteUser(Long id);
    UserResponse createUser(UserCreateRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}