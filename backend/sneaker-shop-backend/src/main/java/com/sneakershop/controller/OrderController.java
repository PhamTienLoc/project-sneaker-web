package com.sneakershop.controller;

import com.sneakershop.dto.request.OrderRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.OrderResponse;
import com.sneakershop.entity.User;
import com.sneakershop.service.OrderService;
import com.sneakershop.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<OrderResponse>builder()
                .message("Tạo đơn hàng thành công")
                .result(orderService.createOrder(user.getId(), request))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(Authentication authentication, @PathVariable Long orderId) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrder(user.getId(), orderId))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<OrderResponse>> getUserOrders(Authentication authentication, Pageable pageable) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderService.getUserOrders(user.getId(), pageable))
                .build();
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return ApiResponse.<OrderResponse>builder()
                .message("Cập nhật trạng thái đơn hàng thành công")
                .result(orderService.updateOrderStatus(orderId, status))
                .build();
    }

    @PostMapping("/{orderId}/cancel")
    public ApiResponse<Void> cancelOrder(Authentication authentication, @PathVariable Long orderId) {
        User user = (User) authentication.getPrincipal();
        orderService.cancelOrder(user.getId(), orderId);
        return ApiResponse.<Void>builder()
                .message("Hủy đơn hàng thành công")
                .build();
    }
}