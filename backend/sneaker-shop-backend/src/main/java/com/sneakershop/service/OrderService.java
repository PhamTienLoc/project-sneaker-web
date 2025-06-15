package com.sneakershop.service;

import com.sneakershop.dto.request.OrderRequest;
import com.sneakershop.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderRequest request);
    OrderResponse getOrder(Long userId, Long orderId);
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);
    OrderResponse updateOrderStatus(Long orderId, String status);
    void cancelOrder(Long userId, Long orderId);
}