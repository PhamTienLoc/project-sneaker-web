package com.sneakershop.service;

import com.sneakershop.dto.request.*;
import com.sneakershop.dto.response.*;
import com.sneakershop.entity.User;
import com.sneakershop.repository.UserRepository;
import com.sneakershop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email đã được sử dụng");
        User user = User.builder()
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .name(req.getName())
                .build();
        userRepo.save(user);
    }

    public JwtResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Mật khẩu không đúng");
        return new JwtResponse(jwtUtil.generateToken(user.getEmail()));
    }
}
