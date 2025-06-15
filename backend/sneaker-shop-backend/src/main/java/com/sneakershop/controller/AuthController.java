package com.sneakershop.controller;

import com.sneakershop.dto.request.LoginRequest;
import com.sneakershop.dto.request.RegisterRequest;
import com.sneakershop.dto.response.ApiResponse;
import com.sneakershop.dto.response.JwtResponse;
import com.sneakershop.entity.User;
import com.sneakershop.security.JwtTokenProvider;
import com.sneakershop.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthenticationManager authenticationManager;
    UserService userService;
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ApiResponse<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userService.findByUsername(loginRequest.getUsername());
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        return ApiResponse.<JwtResponse>builder()
                .message("Đăng nhập thành công")
                .result(new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), roles)).build();
    }

    @PostMapping("/register")
    public ApiResponse<Void> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.register(registerRequest);
        return ApiResponse.<Void>builder()
                .message("Đăng ký thành công")
                .build();
    }
}