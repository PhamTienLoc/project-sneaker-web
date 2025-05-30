package com.sneakershop.dto.controller;

import com.sneakershop.dto.request.*;
import com.sneakershop.dto.response.*;
import com.sneakershop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse me() {
        return userService.getCurrentUser();
    }
    @PutMapping("/me")
    public UserResponse update(@RequestBody UpdateUserRequest req) {
        return userService.updateCurrentUser(req);
    }

    @GetMapping("/orders")
    public List<OrderResponse> orders() {
        return userService.getUserOrders();
    }
}
