package com.sneakershop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import com.sneakershop.constant.OrderStatus;
import com.sneakershop.constant.PaymentStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItem> items = new ArrayList<>();

    @Column(name = "total_amount", nullable = false)
    BigDecimal totalAmount;

    @Column(name = "shipping_address", nullable = false)
    String shippingAddress;

    @Column(name = "phone_number", nullable = false)
    String phoneNumber;

    @Column(name = "email", nullable = false)
    String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    OrderStatus status;

    @Column(name = "payment_method", nullable = false)
    String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "note")
    String note;

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public void clear() {
        items.clear();
    }
} 