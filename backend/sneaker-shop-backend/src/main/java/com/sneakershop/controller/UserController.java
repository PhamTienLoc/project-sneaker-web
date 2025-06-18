package com.sneakershop.controller;

import com.sneakershop.dto.request.ChangePasswordRequest;
import com.sneakershop.dto.request.UserCreateRequest;
import com.sneakershop.dto.request.UserUpdateRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.UserResponse;
import com.sneakershop.entity.User;
import com.sneakershop.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<UserResponse> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<UserResponse>builder()
                .result(userService.getCurrentUser(user.getId()))
                .build();
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<UserResponse> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UserUpdateRequest request) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<UserResponse>builder()
                .message("Cập nhật thông tin thành công")
                .result(userService.updateUser(user.getId(), request))
                .build();
    }

    @PutMapping("/me/change-password")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        User user = (User) authentication.getPrincipal();
        userService.changePassword(user.getId(), request);
        return ApiResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("Cập nhật thông tin người dùng thành công")
                .result(userService.updateUser(id, request))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("Tạo người dùng thành công")
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<UserResponse>> getAllUsers(Pageable pageable) {
        return ApiResponse.<Page<UserResponse>>builder()
                .result(userService.getAllUsers(pageable))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.<Void>builder()
                .message("Xóa người dùng thành công")
                .build();
    }
} 