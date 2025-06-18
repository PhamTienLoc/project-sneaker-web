package com.sneakershop.controller;

import com.sneakershop.dto.request.OrderRequest;
import com.sneakershop.dto.request.OrderUpdateRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.OrderResponse;
import com.sneakershop.entity.User;
import com.sneakershop.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/my-orders")
    public ApiResponse<Page<OrderResponse>> getUserOrders(Authentication authentication, Pageable pageable) {
        User user = (User) authentication.getPrincipal();
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderService.getUserOrders(user.getId(), pageable))
                .build();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .result(orderService.getAllOrders(pageable))
                .build();
    }

    @PutMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<OrderResponse> updateOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderUpdateRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateOrder(orderId, request))
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me/{orderId}/cancel")
    public ApiResponse<Void> cancelMyOrder(Authentication authentication, @PathVariable Long orderId) {
        User user = (User) authentication.getPrincipal();
        orderService.cancelOrder(user.getId(), orderId);
        return ApiResponse.<Void>builder()
                .message("Hủy đơn hàng thành công")
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{orderId}/cancel")
    public ApiResponse<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.adminCancelOrder(orderId);
        return ApiResponse.<Void>builder()
                .message("Hủy đơn hàng thành công")
                .build();
    }
}