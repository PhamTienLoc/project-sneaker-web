package com.sneakershop.dto.request;

import com.sneakershop.constant.OrderStatus;
import com.sneakershop.constant.PaymentStatus;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class OrderUpdateRequest {
    private String shippingAddress;
    private String phoneNumber;

    @Email(message = "INVALID_EMAIL_FORMAT")
    private String email;

    private String paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;
    private String note;
    private Boolean isActive;
}