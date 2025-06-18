package com.sneakershop.exception;

public enum ErrorCode {
    // Common: 1000–1099
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized exception"),
    INVALID_KEY(1001, "Invalid message key"),
    INVALID_REQUEST(1002, "Invalid request"),

    // Auth/User: 1100–1199
    USER_EXISTED(1100, "User already exists"),
    USER_NOT_FOUND(1101, "User not found"),
    INVALID_USERNAME(1102, "Username phải từ 3-50 ký tự"),
    INVALID_PASSWORD(1103, "Password phải có ít nhất 6 ký tự"),
    USER_NOT_EXISTED(1104, "User not exists"),
    UNAUTHENTICATED(1105, "Unauthenticated"),
    EMAIL_EXISTED(1106, "Email already exists"),
    ROLE_NOT_FOUND(1107, "Role not found"),
    USERNAME_REQUIRED(1108, "Username không được để trống"),
    FIRSTNAME_REQUIRED(1109, "Họ không được để trống"),
    LASTNAME_REQUIRED(1110, "Tên không được để trống"),
    ADDRESS_REQUIRED(1111, "Địa chỉ không được để trống"),
    INVALID_PHONE_NUMBER(1112, "Số điện thoại phải có 10 chữ số"),
    PASSWORD_REQUIRED(1113, "Password không được để trống"),

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
    FILE_INIT_FAILED(1211, "Khởi tạo thư mục gốc thất bại"),
    FILE_NOT_FOUND(1212, "Không tìm thấy ảnh"),
    FILE_LOAD_FAILED(1213, "Không tải ảnh lên được"),
    FILE_DELETE_FAILED(1214, "Không xóa ảnh được"),
    IMAGE_NOT_FOUND(1215, "Không tìm thấy ảnh"),
    INVALID_IMAGE_TYPE(1216, "Loại ảnh không hợp lệ"),
    FILE_UPLOAD_FAILED(1217, "Lỗi khi upload file"),
    IMAGE_SAVE_FAILED(1217, "Không thể lưu ảnh vào database"),
    UNSUPPORTED_FILE_FORMAT(1218, "Định dạng ảnh không được hỗ trợ"),
    PRODUCT_NAME_EXISTS(1218, "Tên sản phẩm đã tồn tại"),
    INVALID_LIMIT(1220, "Số lượng sản phẩm mới không hợp lệ"),


    // Cart: 1300–1399
    CART_EMPTY(1300, "Cart is empty"),
    ITEM_NOT_FOUND(1301, "Không tìm thấy sản phẩm"),
    INVALID_SIZE(1302, "Size giày không hợp lệ"),
    INVALID_COLOR(1301, "Màu giày không hợp lệ"),
    PRODUCT_ID_REQUIRED(1302, "Phải chọn sản phẩm"),
    SIZE_REQUIRED(1303, "Size không được để trống"),
    COLOR_REQUIRED(1304, "Màu sắc không được để trống"),
    QUANTITY_REQUIRED(1305, "Số lượng không được để trống"),
    QUANTITY_MINIMUM(1306, "Số lượng phải từ 1 trở lên"),


    // Order: 1400–1499
    ORDER_NOT_FOUND(1400, "Order not found"),
    SHIPPING_ADDRESS_REQUIRED(1401, "Địa chỉ giao hàng không được để trống"),
    PHONE_NUMBER_REQUIRED(1402, "Số điện thoại không được để trống"),
    EMAIL_REQUIRED(1403, "Email không được để trống"),
    INVALID_EMAIL_FORMAT(1404, "Email không đúng định dạng"),
    PAYMENT_METHOD_REQUIRED(1405, "Phương thức thanh toán không được để trống"),
    INVALID_ORDER_STATUS(1406, "Trạng thái đơn hàng không hợp lệ"),
    CANNOT_CANCEL_ORDER(1407, "Không thể hủy đơn hàng trong trạng thái này"),
    ;

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

