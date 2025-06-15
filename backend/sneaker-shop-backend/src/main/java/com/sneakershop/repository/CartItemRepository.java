package com.sneakershop.repository;

import com.sneakershop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductIdAndSizeAndColor(Long cartId, Long productId, String size, String color);
    void deleteByCartId(Long cartId);
}