package com.sneakershop.entity;

import com.sneakershop.constant.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Column(name = "payment_status", nullable = false)
    String paymentStatus;

    @Column(name = "note")
    String note;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

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