package com.sneakershop.controller;

import com.sneakershop.dto.request.CartItemRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.CartResponse;
import com.sneakershop.entity.User;
import com.sneakershop.service.CartService;
import com.sneakershop.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;
    UserService userService;

    @GetMapping
    public ApiResponse<CartResponse> getCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCart(user.getId()))
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        return ApiResponse.<CartResponse>builder()
                .message("Thêm sản phẩm thành công")
                .result(cartService.addItem(user.getId(), request))
                .build();
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        return ApiResponse.<CartResponse>builder()
                .message("Cập nhật giỏ hàng thành công")
                .result(cartService.updateItem(user.getId(), itemId, quantity))
                .build();
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeItem(@PathVariable Long itemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        return ApiResponse.<CartResponse>builder()
                .message("Đã xóa sản phẩm khỏi giỏ hàng")
                .result(cartService.removeItem(user.getId(), itemId))
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        cartService.clearCart(user.getId());
        return ApiResponse.<Void>builder()
                .message("Giỏ hàng đã được làm trống")
                .build();
    }
}