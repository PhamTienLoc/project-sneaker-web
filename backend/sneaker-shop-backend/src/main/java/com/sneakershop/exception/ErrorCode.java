package com.sneakershop.exception;

public enum ErrorCode {
    // Common: 1000–1099
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized exception"),
    INVALID_KEY(1001, "Invalid message key"),

    // Auth/User: 1100–1199
    USER_EXISTED(1100, "User already exists"),
    USER_NOT_FOUND(1101, "User not found"),
    INVALID_USERNAME(1102, "Username must be at least 5 characters"),
    INVALID_PASSWORD(1103, "Password must be at least 8 characters"),
    USER_NOT_EXISTED(1104, "User not exists"),
    UNAUTHENTICATED(1105, "Unauthenticated"),

    // Product: 1200–1299
    PRODUCT_NOT_FOUND(1200, "Product not found"),
    NAME_MUST_NOT_BE_BLANK(1201, "Tên không được để trống"),
    PRICE_MUST_NOT_BE_NULL(1202, "Giá không được để trống"),
    PRICE_MUST_BE_POSITIVE (1203, "Giá phải lớn hơn 0"),
    BRAND_ID_REQUIRED (1204, "Phải chọn thương hiệu"),
    BRAND_NOT_FOUND(1205, "Brand not found"),
    BRAND_NAME_MUST_NOT_BE_BLANK(1206, "Tên thương hiệu không được để trống"),
    BRAND_NAME_EXISTS(1207, "Tên thương hiệu đã tồn tại"),
    CATEGORY_NOT_FOUND(1208, "Category not found"),
    CATEGORY_NAME_BLANK(1209, "Tên không được để trống"),
    CATEGORY_NAME_EXISTS(1210, "Tên danh mục đã tồn tại"),

    // Cart: 1300–1399
    CART_EMPTY(1300, "Cart is empty"),

    // Order: 1400–1499
    ORDER_NOT_FOUND(1400, "Order not found");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

