package com.sneakershop.service;

import com.sneakershop.dto.request.OrderRequest;
import com.sneakershop.dto.request.OrderUpdateRequest;
import com.sneakershop.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderRequest request);
    OrderResponse getOrder(Long userId, Long orderId);
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);
    Page<OrderResponse> getAllOrders(Pageable pageable);
    OrderResponse updateOrder(Long userId, OrderUpdateRequest request);
    void cancelOrder(Long userId, Long orderId);
    void adminCancelOrder(Long orderId);
} 