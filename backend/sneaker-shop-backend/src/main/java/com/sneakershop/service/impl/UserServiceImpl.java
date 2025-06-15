package com.sneakershop.service.impl;

import com.sneakershop.constant.RoleType;
import com.sneakershop.dto.request.RegisterRequest;
import com.sneakershop.entity.Role;
import com.sneakershop.entity.User;
import com.sneakershop.exception.AppException;
import com.sneakershop.exception.ErrorCode;
import com.sneakershop.mapper.UserMapper;
import com.sneakershop.repository.RoleRepository;
import com.sneakershop.repository.UserRepository;
import com.sneakershop.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role userRole = roleRepository.findByName(RoleType.ROLE_USER.name()).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.addRole(userRole);

        return userRepository.save(user);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}