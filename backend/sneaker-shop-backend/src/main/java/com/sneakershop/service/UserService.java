package com.sneakershop.service;

import com.sneakershop.dto.request.*;
import com.sneakershop.dto.response.*;
import com.sneakershop.entity.*;
import com.sneakershop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final OrderRepository orderRepo;
    private final PasswordEncoder encoder;

    public UserResponse getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }
    public UserResponse updateCurrentUser(UpdateUserRequest req) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(email).orElseThrow();

        if (!req.getEmail().equals(user.getEmail()) && userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        user.setName(req.getName());
        user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(req.getPassword()));
        }

        userRepo.save(user);
        return getCurrentUser();
    }

    public List<OrderResponse> getUserOrders() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(email).orElseThrow();

        return orderRepo.findByUserId(user.getId()).stream().map(order ->
                OrderResponse.builder()
                        .id(order.getId())
                        .status(order.getStatus())
                        .total(order.getTotal())
                        .createdAt(order.getCreatedAt().toString())
                        .build()
        ).collect(Collectors.toList());
    }
}
