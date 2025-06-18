package com.sneakershop.dto.request;

import com.sneakershop.entity.PaymentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank(message = "SHIPPING_ADDRESS_REQUIRED")
    private String shippingAddress;

    @NotBlank(message = "PHONE_NUMBER_REQUIRED")
    private String phoneNumber;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL_FORMAT")
    private String email;

    @NotBlank(message = "PAYMENT_METHOD_REQUIRED")
    private String paymentMethod;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String note;
}