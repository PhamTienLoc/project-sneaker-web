package com.sneakershop.service.impl;

import com.sneakershop.dto.request.CartItemRequest;
import com.sneakershop.dto.response.CartResponse;
import com.sneakershop.entity.Cart;
import com.sneakershop.entity.CartItem;
import com.sneakershop.entity.Product;
import com.sneakershop.entity.User;
import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.mapper.CartMapper;
import com.sneakershop.repository.CartItemRepository;
import com.sneakershop.repository.CartRepository;
import com.sneakershop.repository.ProductRepository;
import com.sneakershop.repository.UserRepository;
import com.sneakershop.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.getSizes().contains(request.getSize())) {
            throw new AppException(ErrorCode.INVALID_SIZE);
        }
        if (!product.getColors().contains(request.getColor())) {
            throw new AppException(ErrorCode.INVALID_COLOR);
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndProductIdAndSizeAndColor(cart.getId(), product.getId(), request.getSize(), request.getColor()).orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setSize(request.getSize());
            newItem.setColor(request.getColor());
            newItem.setQuantity(request.getQuantity());
            newItem.setPrice(product.getPrice().doubleValue());
            cart.addItem(newItem);
            cartRepository.save(cart);
        }

        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.ITEM_NOT_FOUND);
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.ITEM_NOT_FOUND);
        }

        cart.removeItem(item);
        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }
}