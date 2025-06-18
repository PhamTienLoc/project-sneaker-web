package com.sneakershop.constant;

public enum OrderStatus {
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    SHIPPING("Shipping"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
} 